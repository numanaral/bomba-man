import Button from 'components/Button';
import config from 'config';
import { useState } from 'react';
import styled from 'styled-components';
import { generateRandomGameMap } from 'utils/game';
import Bomb from './Bomb';
import Character from './Character';
import Map from './Map';
import { BombType, AddBomb } from './types';

const CenteredDiv = styled.div<{ $is3D: boolean }>`
	text-align: center;
	${({ $is3D }) => ($is3D && 'perspective: 1000') || ''}
`;

const Game = () => {
	const [gameMap, setGameMap] = useState(() =>
		generateRandomGameMap(config.size.game)
	);
	const [is3D, setIs3D] = useState(false);
	const [isTopView, setIsTopView] = useState(true);
	const [bombs, setBombs] = useState<Array<BombType>>([]);

	const generateNewCollisionCoordinates = () => {
		setGameMap(generateRandomGameMap(config.size.game));
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

	return (
		<CenteredDiv $is3D={is3D}>
			<h1>Bomberman - Work In Progress</h1>
			<Button
				variant="secondary"
				size="medium"
				onClick={generateNewCollisionCoordinates}
			>
				New Collision Coordinates
			</Button>
			<Button
				variant={is3D ? 'primary' : 'secondary'}
				size="medium"
				onClick={toggle3D}
			>
				Toggle 3D (Experimental)
			</Button>

			<Button
				variant={isTopView ? 'secondary' : 'primary'}
				size="medium"
				onClick={toggleView}
				disabled={!is3D}
			>
				Toggle Side View
			</Button>

			<br />
			<br />
			<Map
				size={config.size.game}
				gameMap={gameMap}
				is3D={is3D}
				isTopView={isTopView}
			>
				<Character
					name="temp"
					gameMap={gameMap}
					is3D={is3D}
					addBomb={addBomb}
				/>
				{bombs.map(({ id, ...bombProps }) => (
					<Bomb
						key={id}
						{...bombProps}
						color="red"
						explosionSize={config.size.explosion}
						firingDuration={config.duration.bomb.firing}
						explodingDuration={config.duration.bomb.exploding}
					/>
				))}
			</Map>
		</CenteredDiv>
	);
};

export default Game;
