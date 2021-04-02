import config from 'config';
import Cube from 'containers/Game/Cube';
import { Direction } from 'enums';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import theme from 'theme';
import {
	resetRotation,
	canMove,
	handleRotateMove,
	CUBE_BASE_TRANSFORM,
} from 'utils/game';

const StyledTempCharacterName = styled.span`
	color: red;
`;

const StyledTempCharacterFace = styled.div`
	color: #000;
`;
const StyledTempCharacterEyes = styled.span``;
const StyledTempCharacterMouth = styled.span``;

const StyledTempCharacter = styled.div<{ $name: string }>`
	width: ${theme.game.character.size};
	height: ${theme.game.character.size};
	background-color: ${theme.palette.color.primary};
	position: absolute;
	top: 0;
	left: 0;
	border-radius: 50%;
	display: flex;
	justify-content: center;

	transition: top ${config.duration.movement}ms,
		left ${config.duration.movement}ms;

	& > ${StyledTempCharacterName} {
		z-index: 9999;
		position: absolute;
		top: -20px;
		font-size: 10px;
	}

	& > ${StyledTempCharacterFace} {
		position: absolute;
		top: 7px;
		font-size: 8px;

		/* & > ${StyledTempCharacterEyes} {
		}
		& > ${StyledTempCharacterMouth} {
		} */
	}
`;

interface Props {
	name: string;
	// skin: Skin;
	collisionCoordinates?: CollisionCoordinates;
	is3D: boolean;
	addBomb: AddBomb;
}

const Character = ({
	name /* skin */,
	collisionCoordinates,
	is3D,
	addBomb,
}: Props) => {
	const characterRef = useRef<HTMLDivElement>(null);
	const timeOutRef = useRef(new Date().getTime());
	const keyMap = useRef<{
		[key: string]: boolean;
	}>({});

	useEffect(() => {
		const move = () => {
			if (!characterRef.current) return;
			if (!keyMap.current) return;

			// reset rotation to 0 so the animations are consistent
			resetRotation(characterRef);

			if (keyMap.current.ArrowUp) {
				const newX = characterRef.current.offsetLeft;
				const newY =
					characterRef.current.offsetTop - config.size.movement;
				if (canMove(newX, newY, collisionCoordinates)) {
					characterRef.current.style.top = `${newY}px`;
					handleRotateMove(characterRef, is3D, Direction.UP);
				}
			}
			if (keyMap.current.ArrowRight) {
				const newX =
					characterRef.current.offsetLeft + config.size.movement;
				const newY = characterRef.current.offsetTop;
				if (canMove(newX, newY, collisionCoordinates)) {
					characterRef.current.style.left = `${newX}px`;
					handleRotateMove(characterRef, is3D, Direction.RIGHT);
				}
			}
			if (keyMap.current.ArrowDown) {
				const newX = characterRef.current.offsetLeft;
				const newY =
					characterRef.current.offsetTop + config.size.movement;
				if (canMove(newX, newY, collisionCoordinates)) {
					characterRef.current.style.top = `${newY}px`;
					handleRotateMove(characterRef, is3D, Direction.DOWN);
				}
			}
			if (keyMap.current.ArrowLeft) {
				const newX =
					characterRef.current.offsetLeft - config.size.movement;
				const newY = characterRef.current.offsetTop;
				if (canMove(newX, newY, collisionCoordinates)) {
					characterRef.current.style.left = `${newX}px`;
					handleRotateMove(characterRef, is3D, Direction.LEFT);
				}
			}
		};

		/** @see https://stackoverflow.com/questions/5203407/how-to-detect-if-multiple-keys-are-pressed-at-once-using-javascript#answer-12444641 */
		const registerKeys = (e: KeyboardEvent) => {
			if (!keyMap.current) return;
			if (!timeOutRef.current) return;
			keyMap.current[e.code] = e.type === 'keydown';

			if (e.type === 'keydown') {
				const newTime = new Date().getTime();
				if (newTime - timeOutRef.current > config.duration.movement) {
					timeOutRef.current = newTime;
					move();
				}
				if (e.code === 'Space') {
					if (!characterRef.current) return;
					addBomb({
						top: characterRef.current.offsetTop,
						left: characterRef.current.offsetLeft,
					});
				}
			}
		};

		window.addEventListener('keyup', registerKeys);
		window.addEventListener('keydown', registerKeys);

		return () => {
			window.removeEventListener('keyup', registerKeys);
			window.removeEventListener('keydown', registerKeys);
		};
	}, [addBomb, collisionCoordinates, is3D]);

	return (
		(is3D && (
			<Cube
				ref={characterRef}
				size={32}
				left={0}
				top={0} /* name={name} */
				animate
				color={theme.palette.color.primary}
				style={{
					transform: CUBE_BASE_TRANSFORM,
				}}
			/>
		)) || (
			<StyledTempCharacter ref={characterRef} $name={name}>
				<StyledTempCharacterName>{name}</StyledTempCharacterName>
				<StyledTempCharacterFace>
					<StyledTempCharacterEyes>o-o</StyledTempCharacterEyes>
					<br />
					<StyledTempCharacterMouth>===</StyledTempCharacterMouth>
				</StyledTempCharacterFace>
			</StyledTempCharacter>
		)
	);
};

export default Character;
