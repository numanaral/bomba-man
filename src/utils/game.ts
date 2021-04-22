import config from 'config';
import { ExplosionProps } from 'containers/Game/components/Bomb';
import {
	GameMap,
	KeyMap,
	NextMoveProps,
	NonNullablePlayerRef,
	PlayerConfig,
	PlayerId,
	PlayerKeyboardConfig,
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
		// reverse block density, we want that many Emptys
		...Array(11 - config.game.blockDensity).fill('Empty'),
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

const CUBE_BASE_TRANSFORM = `translateZ(calc(var(--tile-size) / 2 * 1px)) rotateX(0deg) rotateY(0deg) scale(1, 1)`;
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

const getExplosionCoordinates = (
	{ explosionAxis, explosionSize }: ExplosionProps,
	is3D = false
) => {
	let overflowLimit = 0.5;
	let baseSize = 2;
	let explosionScaleSize = getExplosionScaleSize(explosionSize);
	if (is3D) {
		overflowLimit = 0;
		baseSize = 1;
		explosionScaleSize /= 2;
	}

	let x = baseSize;
	let y = baseSize;

	if (explosionAxis === Axis.X) x = explosionScaleSize;
	else y = explosionScaleSize;

	// prevent overflow
	x -= overflowLimit;
	y -= overflowLimit;

	return { x, y };
};

type OnHandleTileBreaking = (
	newGameMap: GameMap,
	ySquare: number,
	xSquare: number
) => void;

type PlayersToKill = Array<PlayerId>;

type OnHandlePlayerKill = (
	players: Players,
	ySquare: number,
	xSquare: number
) => PlayersToKill;

const handleTileBreaking: OnHandleTileBreaking = (
	newGameMap,
	xSquare,
	ySquare
) => {
	if (newGameMap[ySquare][xSquare] === Tile.Breaking) {
		// eslint-disable-next-line no-param-reassign
		newGameMap[ySquare][xSquare] = Tile.Empty;
	}
};

const handlePlayerKill: OnHandlePlayerKill = (players, ySquare, xSquare) => {
	const playersToKill: PlayersToKill = [];
	Object.values<PlayerConfig>(players).forEach(({ id, coordinates }) => {
		const {
			xSquare: playerXSquare,
			ySquare: playerYSquare,
		} = topLeftCoordinatesToSquareCoordinates(coordinates);
		if (playerXSquare === xSquare && playerYSquare === ySquare) {
			playersToKill.push(id);
		}
	});
	return playersToKill;
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
	players: Players,
	bombCoordinates: TopLeftCoordinates,
	explosionSize: number
) => {
	const newGameMap = JSON.parse(JSON.stringify(gameMap));
	const { xSquare, ySquare } = topLeftCoordinatesToSquareCoordinates(
		bombCoordinates
	);
	let playersToKill: Array<PlayerId> = [];

	// ensure that we are checking within the boundaries
	for (
		let currentYSquare = Math.max(0, ySquare - explosionSize);
		currentYSquare <=
		Math.min(config.size.game - 1, ySquare + explosionSize);
		currentYSquare++
	) {
		handleTileBreaking(newGameMap, currentYSquare, xSquare);
		playersToKill = playersToKill.concat(
			handlePlayerKill(players, currentYSquare, xSquare)
		);
	}

	// ensure that we are checking within the boundaries
	for (
		let currentXSquare = Math.max(0, xSquare - explosionSize);
		currentXSquare <=
		Math.min(config.size.game - 1, xSquare + explosionSize);
		currentXSquare++
	) {
		handleTileBreaking(newGameMap, ySquare, currentXSquare);
		playersToKill = playersToKill.concat(
			handlePlayerKill(players, ySquare, currentXSquare)
		);
	}

	return { newGameMap, playersToKill };
};

const getMoveDirectionFromKeyboardCode = (
	keyCode: string,
	{ MoveUp, MoveRight, MoveDown, MoveLeft }: PlayerKeyboardConfig
) => {
	switch (true) {
		case keyCode === MoveUp:
			return Direction.UP;
		case keyCode === MoveRight:
			return Direction.RIGHT;
		case keyCode === MoveDown:
			return Direction.DOWN;
		case keyCode === MoveLeft:
			return Direction.LEFT;
		default:
			return null;
	}
};

const getMoveDirectionFromKeyMap = (
	keyMap: React.MutableRefObject<KeyMap>,
	{ MoveUp, MoveRight, MoveDown, MoveLeft }: PlayerKeyboardConfig
) => {
	return [
		keyMap.current[MoveUp] && Direction.UP,
		keyMap.current[MoveRight] && Direction.RIGHT,
		keyMap.current[MoveDown] && Direction.DOWN,
		keyMap.current[MoveLeft] && Direction.LEFT,
	].filter(Boolean) as Array<Direction>;
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

export {
	generateRandomGameMap,
	canMove,
	rotateMove,
	handleRotateMove,
	handleMove,
	resetRotation,
	CUBE_BASE_TRANSFORM,
	getExplosionScaleSize,
	getExplosionCoordinates,
	handleExplosionOnGameMap,
	playerGenerator,
	getMoveDirectionFromKeyboardCode,
	getMoveDirectionFromKeyMap,
	MAX_GAME_SIZE,
	MIN_GAME_SIZE,
};
