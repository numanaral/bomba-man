import Button from 'components/Button';
import config from 'config';
import { useState } from 'react';
import styled from 'styled-components';
import { generateRandomCollision } from 'utils/game';
import Character from './Character';
import Map from './Map';

const CenteredDiv = styled.div<{ $is3D: boolean }>`
	text-align: center;
	${({ $is3D }) => ($is3D && 'perspective: 1000') || ''}
`;

const Game = () => {
	const [collisionCoordinates, setCollisionCoordinates] = useState(() =>
		generateRandomCollision()
	);
	const [is3D, setIs3D] = useState(false);
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
				collisionCoordinates={collisionCoordinates}
				is3D={is3D}
				isTopView={isTopView}
			>
				<Character
					name="temp"
					collisionCoordinates={collisionCoordinates}
					is3D={is3D}
				/>
			</Map>
		</CenteredDiv>
	);
};

export default Game;
