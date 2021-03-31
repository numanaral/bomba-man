import Cube from 'containers/Game/Cube';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import theme from 'theme';

interface Props {
	name: string;
	// skin: Skin;
	collisionCoordinates?: CollisionCoordinates;
	is3D: boolean;
}

const StyledTempCharacterName = styled.span`
	color: red;
`;

const StyledTempCharacterFace = styled.div`
	color: #000;
`;
const StyledTempCharacterEyes = styled.span``;
const StyledTempCharacterMouth = styled.span``;

const MOVE_SIZE = 32;
const BOUNDARY_MIN = 0;
const BOUNDARY_MAX = MOVE_SIZE * (15 - 1);
const MOVE_DURATION = 300;
// const MOVE_DURATION = 50;

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

	transition: top ${MOVE_DURATION}ms, left ${MOVE_DURATION}ms;

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

const canMove = (
	x: number,
	y: number,
	collisionCoordinates: CollisionCoordinates = {}
) => {
	const isObstacle = collisionCoordinates[x / MOVE_SIZE] === y / MOVE_SIZE;
	const isHorizontalEnd = x < BOUNDARY_MIN || x > BOUNDARY_MAX;
	const isVerticalEnd = y < BOUNDARY_MIN || y > BOUNDARY_MAX;
	return !isObstacle && !isHorizontalEnd && !isVerticalEnd;
};

enum Direction {
	UP = 'UP',
	RIGHT = 'RIGHT',
	DOWN = 'DOWN',
	LEFT = 'LEFT',
}

enum Axis {
	X = 'X',
	Y = 'Y',
	Z = 'Z',
}

const ROTATION_REGEX = {
	[Axis.X]: {
		REPLACE: /rotateX\(-?\d+deg\)/g,
		FIND: /rotateX\((?<degree>-?\d+)deg\)/,
	},
	[Axis.Y]: {
		REPLACE: /rotateY\(-?\d+deg\)/g,
		FIND: /rotateY\((?<degree>-?\d+)deg\)/,
	},
	[Axis.Z]: {
		REPLACE: /rotateZ\(-?\d+deg\)/g,
		FIND: /rotateZ\((?<degree>-?\d+)deg\)/,
	},
};

const rotateMove = (originalTransform: string, direction: Direction) => {
	// 90deg is a lot harder to handle for movements on the y axis
	// This is because on
	// let rotate = 180;
	let rotate = 90;
	let side = Axis.Y;
	if (direction === Direction.DOWN || direction === Direction.LEFT) {
		rotate *= -1;
	}
	if (direction === Direction.UP || direction === Direction.DOWN) {
		side = Axis.X;
	}

	if (side === Axis.Y) {
		const xDegree = Number(
			originalTransform.match(ROTATION_REGEX[Axis.X].FIND)?.groups
				?.degree || 0
		);
		if (Math.abs((xDegree / 180) % 2) === 1) {
			rotate *= -1;
		} else if (Math.abs((xDegree / 90) % 2) === 1) {
			rotate *= -1;
			side = Axis.Z;
		}
	}
	// if (side === AXIS.Y) {
	// 	const xDegree = Number(
	// 		originalTransform.match(ROTATION_REGEX[AXIS.X].FIND)?.groups
	// 			?.degree || 0
	// 	);
	// 	if (Math.abs((xDegree / 90) % 2) === 1) {
	// 		rotate *= 1;
	// 		side = AXIS.X;
	// 	}
	// }

	const currentDegree = Number(
		originalTransform.match(ROTATION_REGEX[side].FIND)?.groups?.degree || 0
	);

	return originalTransform.replace(
		ROTATION_REGEX[side].REPLACE,
		`rotate${side}(${currentDegree + rotate}deg)`
	);
};

const handleRotateMove = (
	characterRef: React.RefObject<HTMLDivElement>,
	is3D: boolean,
	direction: Direction
) => {
	if (!is3D) return;
	/* eslint-disable no-param-reassign */
	characterRef!.current!.style.transform = rotateMove(
		characterRef!.current!.style.transform,
		direction
	);
	/* eslint-enable no-param-reassign */
};

const Character = ({ name /* skin */, collisionCoordinates, is3D }: Props) => {
	const characterRef = useRef<HTMLDivElement>(null);
	const timeOutRef = useRef(new Date().getTime());
	const keyMap = useRef<{
		[key: string]: boolean;
	}>({});

	useEffect(() => {
		const move = () => {
			if (!characterRef.current) return;
			if (!keyMap.current) return;

			if (keyMap.current.ArrowUp) {
				const newX = characterRef.current.offsetLeft;
				const newY = characterRef.current.offsetTop - MOVE_SIZE;
				if (canMove(newX, newY, collisionCoordinates)) {
					characterRef.current.style.top = `${newY}px`;
					handleRotateMove(characterRef, is3D, Direction.UP);
				}
			}
			if (keyMap.current.ArrowRight) {
				const newX = characterRef.current.offsetLeft + MOVE_SIZE;
				const newY = characterRef.current.offsetTop;
				if (canMove(newX, newY, collisionCoordinates)) {
					characterRef.current.style.left = `${newX}px`;
					handleRotateMove(characterRef, is3D, Direction.RIGHT);
				}
			}
			if (keyMap.current.ArrowDown) {
				const newX = characterRef.current.offsetLeft;
				const newY = characterRef.current.offsetTop + MOVE_SIZE;
				if (canMove(newX, newY, collisionCoordinates)) {
					characterRef.current.style.top = `${newY}px`;
					handleRotateMove(characterRef, is3D, Direction.DOWN);
				}
			}
			if (keyMap.current.ArrowLeft) {
				const newX = characterRef.current.offsetLeft - MOVE_SIZE;
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
				if (newTime - timeOutRef.current > MOVE_DURATION) {
					timeOutRef.current = newTime;
					move();
				}
			}
		};

		window.addEventListener('keyup', registerKeys);
		window.addEventListener('keydown', registerKeys);

		return () => {
			window.removeEventListener('keyup', registerKeys);
			window.removeEventListener('keydown', registerKeys);
		};
	}, [collisionCoordinates, is3D]);

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
					transform: `translateZ(calc(var(--size) / 2 * 1px)) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`,
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
