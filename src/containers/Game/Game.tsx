import Button from 'components/Button';
import config from 'config';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { wrapPreventFocusLock } from 'utils';
import { generateRandomGameMap, handleExplosionOnGameMap } from 'utils/game';
import Bomb from './Bomb';
import Character from './Character';
import Map from './Map';
import { BombType, AddBomb, TopLeftCoordinates } from './types';

const CenteredDiv = styled.div<{ $is3D: boolean }>`
	text-align: center;
	${({ $is3D }) => ($is3D && 'perspective: 1000') || ''}
`;

interface GameButtonProps extends Partial<ComponentProps<typeof Button>> {
	active?: boolean;
	onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const GameButton = ({
	active = false,
	onClick,
	children,
	...rest
}: GameButtonProps) => {
	return (
		<Button
			variant={active ? 'success' : 'warning'}
			size="medium"
			onClick={wrapPreventFocusLock(onClick)}
			{...rest}
		>
			{children}
		</Button>
	);
};

const Game = () => {
	const [gameMap, setGameMap] = useState(() =>
		generateRandomGameMap(config.size.game)
	);
	const [animationCounter, setAnimationCounter] = useState(0);
	const [is3D, setIs3D] = useState(false);
	const [isTopView, setIsTopView] = useState(true);
	const [bombs, setBombs] = useState<Array<BombType>>([]);
	const [
		characterCoordinates,
		setCharacterCoordinates,
	] = useState<TopLeftCoordinates>({
		top: 0,
		left: 0,
	});

	const onMove = (coordinates: TopLeftCoordinates) => {
		setCharacterCoordinates(coordinates);
	};

	const generateNewCollisionCoordinates = () => {
		setGameMap(generateRandomGameMap(config.size.game));
		setAnimationCounter(v => v + 1);
	};

	const toggle3D = () => {
		setIs3D(v => !v);
	};

	const toggleView = () => {
		setIsTopView(v => !v);
	};

	const addBomb: AddBomb = ({ top, left }) => {
		setBombs(v => [...v, { id: new Date().toJSON(), top, left }]);
	};

	const onExplosion = useCallback(
		(bombId: string, bombCoordinates: TopLeftCoordinates) => {
			setBombs(v => v.filter(b => b.id !== bombId));
			setGameMap(
				handleExplosionOnGameMap(
					gameMap,
					bombCoordinates,
					config.size.explosion
				)
			);
		},
		[gameMap]
	);

	return (
		<CenteredDiv $is3D={is3D}>
			<h1>Bomberman - Work In Progress</h1>
			<GameButton onClick={generateNewCollisionCoordinates}>
				New Collision Coordinates
			</GameButton>
			<GameButton active={is3D} onClick={toggle3D}>
				Toggle 3D (Experimental)
			</GameButton>
			<GameButton
				active={!isTopView}
				onClick={toggleView}
				disabled={!is3D}
			>
				Toggle Side View
			</GameButton>

			<br />
			<br />
			<Map
				size={config.size.game}
				gameMap={gameMap}
				is3D={is3D}
				isTopView={isTopView}
				animationCounter={animationCounter}
			>
				<Character
					name="Bomber"
					coordinates={characterCoordinates}
					onMove={onMove}
					gameMap={gameMap}
					is3D={is3D}
					addBomb={addBomb}
				/>
				{bombs.map(({ id, ...bombProps }) => (
					<Bomb
						key={id}
						id={id}
						{...bombProps}
						color="red"
						explosionSize={config.size.explosion}
						firingDuration={config.duration.bomb.firing}
						explodingDuration={config.duration.bomb.exploding}
						onExplosion={onExplosion}
					/>
				))}
			</Map>
		</CenteredDiv>
	);
};

export default Game;
