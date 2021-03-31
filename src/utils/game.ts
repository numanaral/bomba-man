import config from 'config';
import { Axis, Direction } from 'enums';
import { getRandomInt } from './math';

// TODO: If a spot is already filled, fille another one
// TOOD: User start spot cannot have a collision
const generateRandomCollision = () => {
	const numberOfCollisions = getRandomInt(
		config.size.collisionMin,
		config.size.collisionMax
	);
	return Array(numberOfCollisions)
		.fill(0)
		.reduce<{ [key: number]: number }>(acc => {
			const x = getRandomInt(2, config.size.game);
			const y = getRandomInt(2, config.size.game);

			// while (true) {
			// 	x = getRandomInt(config.size.game);
			// 	y = getRandomInt(config.size.game);
			// 	if (acc[x] !== y) break;
			// }
			acc[x] = y;
			return acc;
		}, {});
};

const BOUNDARY_MIN = 0;
const BOUNDARY_MAX = config.size.movement * (config.size.game - 1);
const canMove = (
	x: number,
	y: number,
	collisionCoordinates: CollisionCoordinates = {}
) => {
	const isObstacle =
		collisionCoordinates[x / config.size.movement] ===
		y / config.size.movement;
	const isHorizontalEnd = x < BOUNDARY_MIN || x > BOUNDARY_MAX;
	const isVerticalEnd = y < BOUNDARY_MIN || y > BOUNDARY_MAX;
	return !isObstacle && !isHorizontalEnd && !isVerticalEnd;
};

const ROTATION_REGEX = {
	[Axis.X]: {
		REPLACE: /rotateX\(-?\d+deg\)/g,
		FIND: /rotateX\((?<degree>-?\d+)deg\)/,
	},
	[Axis.Y]: {
		REPLACE: /rotateY\(-?\d+deg\)/g,
		FIND: /rotateY\((?<degree>-?\d+)deg\)/,
	},
};

const rotateMove = (originalTransform: string, direction: Direction) => {
	let rotate = 90;
	let side = Axis.Y;
	if (direction === Direction.DOWN || direction === Direction.LEFT) {
		rotate *= -1;
	}
	if (direction === Direction.UP || direction === Direction.DOWN) {
		side = Axis.X;
	}

	return originalTransform.replace(
		ROTATION_REGEX[side].REPLACE,
		`rotate${side}(${rotate}deg)`
	);
};

const handleRotateMove = (
	characterRef: React.RefObject<HTMLDivElement>,
	is3D: boolean,
	direction: Direction
) => {
	if (!is3D) return;
	/* eslint-disable no-param-reassign */
	// enable animation
	characterRef!.current!.style.transition = `${config.duration.movement}ms`;
	// move
	characterRef!.current!.style.transform = rotateMove(
		characterRef!.current!.style.transform,
		direction
	);
	/* eslint-enable no-param-reassign */
};

const CUBE_BASE_TRANSFORM = `translateZ(calc(var(--tile-size) / 2 * 1px)) rotateX(0deg) rotateY(0deg)`;
/**
 * Since we are moving a flat plane and not a cube, the logical sense of
 * rotating a cube doesn't work. Different type of rotations do no always
 * help. One solution is resetting the rotation to 0 so the rotation
 * movement is smooth on each rotation without worrying about boundaries.
 *
 * NOTE: We need to be aware of the animation cancelling
 *
 * @param characterRef ref object
 */
const resetRotation = (characterRef: React.RefObject<HTMLDivElement>) => {
	// disable animation
	characterRef!.current!.style.transition = '0ms';
	// reset
	characterRef!.current!.style.transform = CUBE_BASE_TRANSFORM;
};

export {
	generateRandomCollision,
	canMove,
	rotateMove,
	handleRotateMove,
	resetRotation,
	CUBE_BASE_TRANSFORM,
};
