import config from 'config';
import {
	Coordinates,
	GameMap,
	KeyMap,
	NextMoveProps,
	NonNullablePlayerRef,
	PlayerConfig,
	PlayerId,
	PlayerKeyboardConfig,
	PlayerRef,
	Players,
	PlayerState,
	PowerUpOrNull,
	Square,
	SquareCoordinates,
	TopLeftCoordinates,
} from 'containers/Game/types';
import { Axis, Direction, PowerUp, Tile, Explosive } from 'enums';
import { OnMove, Bomb } from 'store/redux/reducers/game/types';
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
 * @param coordinates Top Left Coordinates.
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

/**
 * Converts from square to pixel.
 *
 * @param coordinates Square Coordinates.
 * @returns Pixel (top, left) version of the coordinates.
 */
const squareCoordinatesToTopLeftCoordinates = ({
	xSquare,
	ySquare,
}: SquareCoordinates) => {
	return {
		top: ySquare * config.size.movement,
		left: xSquare * config.size.movement,
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
		nextSquare === Tile.Breaking ||
		nextSquare === Tile.NonBreaking ||
		nextSquare === Explosive.Bomb;
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
	direction: Direction,
	movementSpeed: number
) => {
	/* eslint-disable no-param-reassign */
	// enable animation
	characterRef.style.transition = `${movementSpeed}ms`;
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
	movementSpeed: number,
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
		if (is3D) handleRotateMove(ref, direction, movementSpeed);
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

type SquareCoordinateArray = Array<SquareCoordinates>;
type TilesToBreak = SquareCoordinateArray;
enum ExplosionDirection {
	HORIZONTAL = 'horizontal',
	VERTICAL = 'vertical',
	CORE = 'core',
}
type CoordinatesToSetOnFire = {
	[ExplosionDirection.HORIZONTAL]: SquareCoordinateArray;
	[ExplosionDirection.VERTICAL]: SquareCoordinateArray;
	[ExplosionDirection.CORE]: SquareCoordinateArray;
};

const getTilesToBreak = (
	gameMap: GameMap,
	ySquare: number,
	xSquare: number
) => {
	const tilesToBreak: TilesToBreak = [];
	if (gameMap[ySquare][xSquare] === Tile.Breaking) {
		tilesToBreak.push({ ySquare, xSquare });
	}

	return tilesToBreak;
};

const getSquareCoordinatesFromSquareOrTopLeftCoordinates = (
	coordinates: Coordinates
) => {
	let xSquare;
	let ySquare;

	if ((coordinates as SquareCoordinates).xSquare !== undefined) {
		xSquare = (coordinates as SquareCoordinates).xSquare;
		ySquare = (coordinates as SquareCoordinates).ySquare;
	} else {
		const _coordinates = topLeftCoordinatesToSquareCoordinates(
			coordinates as TopLeftCoordinates
		);
		xSquare = _coordinates.xSquare;
		ySquare = _coordinates.ySquare;
	}
	return { xSquare, ySquare };
};

const isSquareOutsideBoundaries = (squareCoordinate: number) => {
	return squareCoordinate < 0 || squareCoordinate >= config.size.game;
};

const getExplosionSquareCoordinatesFromBomb = (
	gameMap: GameMap,
	coordinates: Coordinates,
	explosionSize: number,
	/** only returns fire locations */
	checkOnlyFire = false
) => {
	/* 
		===========================
		# LOGIC
		===========================
		> Legend
			- Empty = 'T1',
			- Breaking = 'T2',
			- NonBreaking = 'T3',
			- Bomb = 'B',
		> Config
			- bombSize = 3
		> Current Test Row
		 	- [T1, T1, T3, B, T1, T2, T2]
		 				       ^  ^ these ones
		> Check neighbors (<>: check, x: stop on side):
		 	- [T1, T1, T3, <B>, T1, T2, T2]

		 	- [T1, T1, T3, <B, T1>, T2, T2]
						x
			- [T1, T1, T3, <B, T1, T2>, T2]

			- [T1, T1, T3, <B, T1, T2>, T2]
										x

		> Stop checking when you hit a T2 or T3
			- If T2, include it in the list
		
	*/

	const {
		xSquare: bombX,
		ySquare: bombY,
	} = getSquareCoordinatesFromSquareOrTopLeftCoordinates(coordinates);
	const bombSquareCoordinates = { xSquare: bombX, ySquare: bombY };
	const explosionCoordinates: CoordinatesToSetOnFire = {
		[ExplosionDirection.HORIZONTAL]: [],
		[ExplosionDirection.VERTICAL]: [],
		[ExplosionDirection.CORE]: [bombSquareCoordinates],
	};

	const pushCurrentCoordinates = (
		xSquare: number,
		ySquare: number,
		explosionDirection: ExplosionDirection
	) => {
		explosionCoordinates[explosionDirection].push({
			xSquare,
			ySquare,
		});
	};

	// used to calculate the next square
	// value to add to currentX and currentY square coordinates
	const xyDiff = [
		[0, -1], // Up
		[1, 0], // Right
		[0, 1], // Down
		[-1, 0], // Left
	];

	// required for proper animation
	// (expanding in scale X or Y)
	const directions = [
		ExplosionDirection.VERTICAL,
		ExplosionDirection.HORIZONTAL,
		ExplosionDirection.VERTICAL,
		ExplosionDirection.HORIZONTAL,
	];

	// check all sides
	for (let i = 0; i < 4; i++) {
		let currentX = bombX;
		let currentY = bombY;
		const currentDirection = directions[i];
		let shouldContinue = true;

		// loop until the end of the explosion
		for (let j = 0; j < explosionSize; j++) {
			if (!shouldContinue) continue;

			const [xDiff, yDiff] = xyDiff[i];
			currentX += xDiff;
			currentY += yDiff;

			// don't go out of boundaries
			if (
				isSquareOutsideBoundaries(currentX) ||
				isSquareOutsideBoundaries(currentY)
			) {
				continue;
			}

			const currentSquare = gameMap[currentY][currentX];
			if (checkOnlyFire) {
				// if it's not a fire, then we reached the end
				if (
					currentSquare !== Explosive.FireHorizontal &&
					currentSquare !== Explosive.FireVertical
				) {
					continue;
				}

				pushCurrentCoordinates(currentX, currentY, currentDirection);
			}
			switch (currentSquare) {
				case Tile.Breaking:
					pushCurrentCoordinates(
						currentX,
						currentY,
						currentDirection
					);
					shouldContinue = false;
					break;
				case Tile.NonBreaking:
					shouldContinue = false;
					break;
				// Tile.Empty, Explosive.Bomb, Player.[any], PowerUps.[any]
				default:
					pushCurrentCoordinates(
						currentX,
						currentY,
						currentDirection
					);
					break;
			}
		}
	}

	return explosionCoordinates;
};

/**
 * Breaking tiles are "exploded" and removed from the map.
 *
 * @param gameMap Current state of the game map.
 * @param bombCoordinates TopLeft coordinates of where the bomb is placed.
 * @param explosionSize Size of the explosion.
 * @returns New state for the game map with breaking tiles emptied.
 */
const getExplosionResults = (
	gameMap: GameMap,
	players: Players,
	bombCoordinates: TopLeftCoordinates,
	explosionSize: number,
	/** only returns fire locations */
	checkOnlyFire = false
) => {
	const tilesToBreak: TilesToBreak = [];
	const coordinatesToSetOnFire: CoordinatesToSetOnFire = {
		[ExplosionDirection.HORIZONTAL]: [],
		[ExplosionDirection.VERTICAL]: [],
		[ExplosionDirection.CORE]: [],
	};

	const explosionSquares = getExplosionSquareCoordinatesFromBomb(
		gameMap,
		bombCoordinates,
		explosionSize,
		checkOnlyFire
	);
	// { horizontal, vertical }
	(Object.keys(explosionSquares) as Array<ExplosionDirection>).forEach(
		explosionDirection => {
			explosionSquares[explosionDirection].forEach(
				({ ySquare, xSquare }) => {
					coordinatesToSetOnFire[explosionDirection].push({
						xSquare,
						ySquare,
					});
					getTilesToBreak(gameMap, ySquare, xSquare).forEach(v => {
						tilesToBreak.push(v);
					});
				}
			);
		}
	);

	return { coordinatesToSetOnFire, tilesToBreak };
};

const getPoweredUpValue = (playerState: PlayerState, powerUp: PowerUp) => {
	return (
		playerState[powerUp] +
		playerState.powerUps[powerUp] *
			config.game.powerUpIncreaseValue[powerUp]
	);
};

const generateBomb = ({
	id: playerId,
	coordinates: { top, left },
	state,
}: PlayerConfig) => {
	const explosionSize = getPoweredUpValue(state, PowerUp.BombSize);
	const bomb: Bomb = {
		id: new Date().toJSON(),
		explosionSize,
		top,
		left,
		playerId,
	};
	return bomb;
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
	const { blockDensity, ...defaultState } = config.game;
	return {
		id: playerId,
		coordinates: {
			top: top * 32,
			left: left * 32,
		},
		ref: null,
		state: {
			...defaultState,
			powerUps: { ...defaultState.powerUps },
		},
	};
};

const generatePowerUpOrNull = () => {
	const possiblePowerUpOrNulls: Array<KeysOf<KeysOf<PowerUpOrNull>>> = [
		...Object.values(PowerUp),
		// reverse block density, we want that many nulls
		...Array(6 - config.game.powerUpChance).fill(null),
	];

	return possiblePowerUpOrNulls[getRandomInt(possiblePowerUpOrNulls.length)];
};

const isPowerUp = (square: Square) => {
	return Object.values(PowerUp).includes(square as PowerUp);
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
	getExplosionResults,
	generateBomb,
	playerGenerator,
	getMoveDirectionFromKeyboardCode,
	getMoveDirectionFromKeyMap,
	MAX_GAME_SIZE,
	MIN_GAME_SIZE,
	topLeftCoordinatesToSquareCoordinates,
	squareCoordinatesToTopLeftCoordinates,
	getSquareCoordinatesFromSquareOrTopLeftCoordinates,
	generatePowerUpOrNull,
	isPowerUp,
	getPoweredUpValue,
};
