import config from 'config';
import {
	CharacterKeyboardConfig,
	GameMap,
	KeyMap,
	NextMoveProps,
	NonNullablePlayerRef,
	PlayerConfig,
	PlayerId,
	PlayerRef,
	Players,
	TopLeftCoordinates,
} from 'containers/Game/types';
import { Axis, Direction, Tile } from 'enums';
import { OnMove } from 'store/redux/reducers/game/types';
import { getRandomInt } from './math';

const MIN_GAME_SIZE = 0;
const MAX_GAME_SIZE = config.size.game - 1;
const FORBIDDEN_COORDINATES = [
	// TOP-LEFT
	[MIN_GAME_SIZE, MIN_GAME_SIZE],
	[MIN_GAME_SIZE, MIN_GAME_SIZE + 1],
	[MIN_GAME_SIZE + 1, MIN_GAME_SIZE],
	// TOP-RIGHT
	[MIN_GAME_SIZE, MAX_GAME_SIZE],
	[MIN_GAME_SIZE, MAX_GAME_SIZE - 1],
	[MIN_GAME_SIZE + 1, MAX_GAME_SIZE],
	// BOTTOM-RIGHT
	[MAX_GAME_SIZE, MAX_GAME_SIZE],
	[MAX_GAME_SIZE, MAX_GAME_SIZE - 1],
	[MAX_GAME_SIZE - 1, MAX_GAME_SIZE],
	// BOTTOM-LEFT
	[MAX_GAME_SIZE, MIN_GAME_SIZE],
	[MAX_GAME_SIZE, MIN_GAME_SIZE + 1],
	[MAX_GAME_SIZE - 1, MIN_GAME_SIZE],
];

const generateRandomGameMap = (
	size: number,
	// TODO: characterCoordinates,
	forbiddenCoordinates = FORBIDDEN_COORDINATES
): GameMap => {
	const tiles: Array<KeysOf<typeof Tile>> = [
		...Object.keys(Tile),
		// we want there to be more of a chance for empty tiles for now
		...Array(3).fill('Empty'),
	];
	const randomMap = Array(size)
		.fill(0)
		.map(() =>
			Array(size)
				.fill(0)
				.map(() => Tile[tiles[getRandomInt(tiles.length)]])
		);
	// ensure we don't fill the char beginning squares with blocks
	forbiddenCoordinates.forEach(([y, x]) => {
		if (randomMap[y][x] !== Tile.Empty) {
			randomMap[y][x] = Tile.Empty;
		}
	});

	return randomMap;
};

/**
 * Converts from pixel to square.
 *
 * @param coordinates Coordinates.
 * @returns Square version of the coordinates.
 */
const topLeftCoordinatesToSquareCoordinates = ({
	top,
	left,
}: TopLeftCoordinates) => {
	return {
		ySquare: top / config.size.movement,
		xSquare: left / config.size.movement,
	};
};

const BOUNDARY_MIN = 0;
const BOUNDARY_MAX = config.size.movement * (config.size.game - 1);
const canMove = (top: number, left: number, map: GameMap) => {
	const { xSquare, ySquare } = topLeftCoordinatesToSquareCoordinates({
		top,
		left,
	});
	const nextSquare = map[ySquare]?.[xSquare];
	const isObstacle =
		nextSquare === Tile.Breaking || nextSquare === Tile.NonBreaking;
	const isHorizontalEnd = left < BOUNDARY_MIN || left > BOUNDARY_MAX;
	const isVerticalEnd = top < BOUNDARY_MIN || top > BOUNDARY_MAX;
	return !isObstacle && !isHorizontalEnd && !isVerticalEnd;
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
const resetRotation = (characterRef: NonNullable<PlayerRef>) => {
	// disable animation
	characterRef.style.transition = '0ms';
	// reset
	characterRef.style.transform = CUBE_BASE_TRANSFORM;
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
	characterRef: NonNullablePlayerRef,
	direction: Direction
) => {
	/* eslint-disable no-param-reassign */
	// enable animation
	characterRef.style.transition = `${config.duration.movement}ms`;
	// move
	characterRef.style.transform = rotateMove(
		characterRef.style.transform,
		direction
	);
	/* eslint-enable no-param-reassign */
};

const handleMove = (
	{
		playerConfig: {
			id: playerId,
			coordinates: { top, left },
			ref,
		},
		direction,
		is3D,
		gameMap,
	}: NextMoveProps,
	onComplete: OnMove
) => {
	let newTop = top;
	let newLeft = left;
	switch (direction) {
		case Direction.UP:
			newTop = top - config.size.movement;
			break;
		case Direction.RIGHT:
			newLeft = left + config.size.movement;
			break;
		case Direction.DOWN:
			newTop = top + config.size.movement;
			break;
		case Direction.LEFT:
			newLeft = left - config.size.movement;
			break;
		default:
			// do nothing
			break;
	}

	if (!canMove(newTop, newLeft, gameMap)) return;

	if (is3D) resetRotation(ref);
	// TODO: Do a write-up on this
	// this complexity is required for a smooth 3d rotate move
	// since we are resetting rotation css, we need an async
	// event so that the animation can display smoothly
	setTimeout(() => {
		if (is3D) handleRotateMove(ref, direction);
		onComplete({
			playerId,
			newCoordinates: { top: newTop, left: newLeft },
		});
	}, 0);
};

/**
 * Gets the scale size for an explosion size.
 * - `explosionSize + 1`: explosion size is exclusive of the current square
 * - `* 2`: explosion goes both ways
 * - `- 1`: don't count the root square twice
 * - `* 2`: revert the padding
 *
 * @param explosionSize Size of the explosion.
 * @returns Scale size.
 */
const getExplosionScaleSize = (explosionSize: number) => {
	return ((explosionSize + 1) * 2 - 1) * 2;
};

/**
 * Breaking tiles are "exploded" and removed from the map.
 *
 * @param gameMap Current state of the game map.
 * @param bombCoordinates TopLeft coordinates of where the bomb is placed.
 * @param explosionSize Size of the explosion.
 * @returns New state for the game map with breaking tiles emptied.
 */
const handleExplosionOnGameMap = (
	gameMap: GameMap,
	bombCoordinates: TopLeftCoordinates,
	explosionSize: number
) => {
	const gameMapCopy = JSON.parse(JSON.stringify(gameMap));
	const { xSquare, ySquare } = topLeftCoordinatesToSquareCoordinates(
		bombCoordinates
	);

	// ensure there are no negatives
	for (
		let currentYSquare = Math.max(0, ySquare - explosionSize);
		currentYSquare <= ySquare + explosionSize;
		currentYSquare++
	) {
		if (gameMapCopy[currentYSquare][xSquare] === Tile.Breaking) {
			gameMapCopy[currentYSquare][xSquare] = Tile.Empty;
		}
	}

	// ensure there are no negatives
	for (
		let currentXSquare = Math.max(0, xSquare - explosionSize);
		currentXSquare <= xSquare + explosionSize;
		currentXSquare++
	) {
		if (gameMapCopy[ySquare][currentXSquare] === Tile.Breaking) {
			gameMapCopy[ySquare][currentXSquare] = Tile.Empty;
		}
	}

	return gameMapCopy;
};

const playerGenerator = (
	playerId: PlayerId,
	top: number,
	left: number
): PlayerConfig => {
	return {
		id: playerId,
		coordinates: {
			top: top * 32,
			left: left * 32,
		},
		ref: null,
	};
};

const getMoveDirectionFromKeyMap = (
	keyMap: React.MutableRefObject<KeyMap>,
	{ MoveUp, MoveRight, MoveDown, MoveLeft }: CharacterKeyboardConfig
) => {
	switch (true) {
		case keyMap.current[MoveUp]:
			return Direction.UP;
		case keyMap.current[MoveRight]:
			return Direction.RIGHT;
		case keyMap.current[MoveDown]:
			return Direction.DOWN;
		case keyMap.current[MoveLeft]:
			return Direction.LEFT;
		default:
			return null;
	}
};

type NPCAction = (players: Players, gameMap: GameMap) => void;
const npcAction: NPCAction = (players, gameMap) => {
	console.log('players', players);
	console.log('gameMap', gameMap);
	// TODO;
};

export type { NPCAction };

export {
	generateRandomGameMap,
	canMove,
	rotateMove,
	handleRotateMove,
	handleMove,
	resetRotation,
	CUBE_BASE_TRANSFORM,
	getExplosionScaleSize,
	handleExplosionOnGameMap,
	playerGenerator,
	getMoveDirectionFromKeyMap,
	npcAction,
};
