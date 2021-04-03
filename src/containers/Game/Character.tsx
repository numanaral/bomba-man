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
import { AddBomb, GameMap, TopLeftCoordinates } from './types';

const StyledTempCharacterName = styled.span`
	color: ${theme.palette.color.warning};
`;

const StyledTempCharacterFace = styled.div`
	color: #000;
`;
const StyledTempCharacterEyes = styled.span``;
const StyledTempCharacterMouth = styled.span``;

const StyledTempCharacter = styled.div<{ $name: string }>`
	width: ${theme.game.character.size};
	height: ${theme.game.character.size};
	background-color: ${theme.palette.color.success};
	position: absolute;
	/* top: 0;
	left: 0; */
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
	coordinates: TopLeftCoordinates;
	onMove: (coordinates: TopLeftCoordinates) => void;
	gameMap: GameMap;
	is3D: boolean;
	addBomb: AddBomb;
}

const Character = ({
	name /* skin */,
	coordinates,
	onMove,
	gameMap,
	is3D,
	addBomb,
}: Props) => {
	const characterRef = useRef<HTMLDivElement>(null);
	const timeOutRef = useRef(new Date().getTime());
	const keyMap = useRef<{
		[key: string]: boolean;
	}>({});

	const { top, left } = coordinates;

	useEffect(() => {
		const move = () => {
			if (!characterRef.current) return;
			if (!keyMap.current) return;

			// reset rotation to 0 so the animations are consistent
			if (is3D) resetRotation(characterRef);

			if (keyMap.current.ArrowUp) {
				const newTop = top - config.size.movement;
				const newLeft = left;
				if (canMove(newTop, newLeft, gameMap)) {
					// characterRef.current.style.top = `${left}px`;
					setTimeout(() => {
						onMove({ top: newTop, left: newLeft });
						handleRotateMove(characterRef, is3D, Direction.UP);
					}, 0);
				}
			}
			if (keyMap.current.ArrowRight) {
				const newTop = top;
				const newLeft = left + config.size.movement;
				if (canMove(newTop, newLeft, gameMap)) {
					// characterRef.current.style.left = `${top}px`;
					setTimeout(() => {
						onMove({ top: newTop, left: newLeft });
						handleRotateMove(characterRef, is3D, Direction.RIGHT);
					}, 0);
				}
			}
			if (keyMap.current.ArrowDown) {
				const newTop = top + config.size.movement;
				const newLeft = left;
				if (canMove(newTop, newLeft, gameMap)) {
					// characterRef.current.style.top = `${left}px`;
					setTimeout(() => {
						onMove({ top: newTop, left: newLeft });
						handleRotateMove(characterRef, is3D, Direction.DOWN);
					}, 0);
				}
			}
			if (keyMap.current.ArrowLeft) {
				const newTop = top;
				const newLeft = left - config.size.movement;
				if (canMove(newTop, newLeft, gameMap)) {
					// characterRef.current.style.left = `${top}px`;
					setTimeout(() => {
						onMove({ top: newTop, left: newLeft });
						handleRotateMove(characterRef, is3D, Direction.LEFT);
					}, 0);
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
						top,
						left,
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
	}, [addBomb, gameMap, is3D, left, top, onMove]);

	return (
		(is3D && (
			<Cube
				ref={characterRef}
				size={32}
				left={left}
				top={top} /* name={name} */
				animate
				color={theme.palette.color.success}
				style={{
					transform: CUBE_BASE_TRANSFORM,
					// top,
					// left,
				}}
			/>
		)) || (
			<StyledTempCharacter
				ref={characterRef}
				$name={name}
				style={{
					top,
					left,
				}}
			>
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
