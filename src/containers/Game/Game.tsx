import Button from 'components/Button';
import Character from 'components/Character';
import { useState } from 'react';
import styled from 'styled-components';
import Map from './Map';

const GAME_SIZE = 15;
const COLLISION_RANGE_MIN = Math.floor((GAME_SIZE * GAME_SIZE) / 3);
const COLLISION_RANGE_MAX = Math.floor((GAME_SIZE * GAME_SIZE) / 2);

function getRandomInt(max: number): number;
function getRandomInt(min: number, max: number): number;
function getRandomInt(min: number, max?: number | undefined) {
	const _max = max || min;
	const _min = (max !== undefined && min) || 0;
	return Math.floor(Math.random() * (_max - _min)) + _min;
}

// TODO: If a spot is already filled, fille another one
// TOOD: User start spot cannot have a collision
const generateRandomCollision = () => {
	const numberOfCollisions = getRandomInt(
		COLLISION_RANGE_MIN,
		COLLISION_RANGE_MAX
	);
	return Array(numberOfCollisions)
		.fill(0)
		.reduce<{ [key: number]: number }>(acc => {
			const x = getRandomInt(2, GAME_SIZE);
			const y = getRandomInt(2, GAME_SIZE);

			// while (true) {
			// 	x = getRandomInt(GAME_SIZE);
			// 	y = getRandomInt(GAME_SIZE);
			// 	if (acc[x] !== y) break;
			// }
			acc[x] = y;
			return acc;
		}, {});
};

const CenteredDiv = styled.div`
	text-align: center;
`;

const Game = () => {
	const [collisionCoordinates, setCollisionCoordinates] = useState(() =>
		generateRandomCollision()
	);
	const [is3D, setIs3D] = useState(true);
	const [isTopView, setIsTopView] = useState(true);

	const generateNewCollisionCoordinates = () => {
		setCollisionCoordinates(generateRandomCollision());
	};

	const toggle3D = () => {
		setIs3D(v => !v);
	};

	const toggleView = () => {
		setIsTopView(v => !v);
	};

	return (
		<CenteredDiv>
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
			<Map size={GAME_SIZE} collisionCoordinates={collisionCoordinates}>
				<Character
					name="temp"
					collisionCoordinates={collisionCoordinates}
				/>
			</Map>
		</CenteredDiv>
	);
};

export default Game;
