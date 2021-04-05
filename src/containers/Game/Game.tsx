import Button from 'components/Button';
import config from 'config';
import usePlayerEvents from 'hooks/usePlayerEvents';
import { ComponentProps, useCallback, useState } from 'react';
import styled from 'styled-components';
import { wrapPreventFocusLock } from 'utils';
import {
	generateRandomGameMap,
	handleExplosionOnGameMap,
	playerGenerator,
} from 'utils/game';
import Bomb from './Bomb';
import Character from './Character';
import Map from './Map';
import { BombType, AddBomb, TopLeftCoordinates, PlayerId } from './types';

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

const player1 = playerGenerator('P1', 0);
const player2 = playerGenerator('P2', config.size.game - 1);

type Players = {
	[key in PlayerId]?: {
		coordinates: TopLeftCoordinates;
		ref: React.RefObject<HTMLDivElement>;
	};
};

type OnMove = (id: PlayerId, coordinates: TopLeftCoordinates) => void;

const Game = () => {
	// URGENT: Gotta setup redux
	//  could use useReducer but w/e
	const [gameMap, setGameMap] = useState(() =>
		generateRandomGameMap(config.size.game)
	);
	const [animationCounter, setAnimationCounter] = useState(0);
	const [is3D, setIs3D] = useState(false);
	const [isTopView, setIsTopView] = useState(true);
	const [bombs, setBombs] = useState<Array<BombType>>([]);
	const [players, setPlayers] = useState<Players>({
		...player1,
		// enable for two-player mode by default
		// ...playerTwo,
	});

	const onMove: OnMove = (id, coordinates) => {
		setPlayers(v => ({
			...v,
			[id]: {
				...v[id],
				coordinates,
			},
		}));
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

	const toggleTwoPlayer = () => {
		setPlayers(({ P2, ...rest }) => ({
			// Player 1 will always exist
			...rest,
			...(!P2 && player2),
		}));
	};

	console.log(players);

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

	usePlayerEvents(players, onMove, gameMap, is3D, addBomb);

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
			<GameButton active={!!players.P2} onClick={toggleTwoPlayer}>
				Toggle Two-Player Mode
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
				{(Object.entries(players) as [
					[
						PlayerId,
						{
							coordinates: TopLeftCoordinates;
							ref: React.RefObject<HTMLDivElement>;
						}
					]
				]).map(([id, { coordinates, ref }]) => (
					<Character
						id={id}
						key={id}
						name="Bomber"
						coordinates={coordinates!}
						is3D={is3D}
						ref={ref}
					/>
				))}
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

export type { Players, OnMove };
export default Game;
