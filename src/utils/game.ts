import config from 'config';
import { OnMove, Players } from 'containers/Game/Game';
import {
	AddBomb,
	GameMap,
	MovementNode,
	PlayerId,
	TopLeftCoordinates,
} from 'containers/Game/types';
import { Axis, Direction, Player, Tile } from 'enums';
import { createRef } from 'react';
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

const playerGenerator = (playerId: PlayerId, top: number, left: number) => {
	return {
		[playerId]: {
			coordinates: {
				top: top * 32,
				left: left * 32,
			},
			ref: createRef<HTMLDivElement>(),
		},
	};
};

const generateScore = (
	topCoordinate: number,
	leftCoordinate: number,
	originalCoordinates: TopLeftCoordinates,
	gameMap: GameMap
): number | undefined => {
	if (
		topCoordinate > MAX_GAME_SIZE ||
		leftCoordinate > MAX_GAME_SIZE ||
		topCoordinate < MIN_GAME_SIZE ||
		leftCoordinate < MIN_GAME_SIZE
	) {
		return undefined;
	}
	const square = gameMap[topCoordinate][leftCoordinate];
	if (
		topCoordinate === originalCoordinates.top &&
		leftCoordinate === originalCoordinates.left
	) {
		return 0;
	}
	if (square === Tile.Empty) {
		return 1;
	}
	if (square === Tile.Breaking) {
		return -1;
	}
	if (square === Tile.NonBreaking) {
		return undefined;
	}

	return 0;
};
const generateMovementTree = (
	topCoordinate: number,
	leftCoordinate: number,
	gameMap: GameMap,
	level: number = 1,
	isFirst = true,
	originalCoordinates: TopLeftCoordinates | null = null
) => {
	const playerMovementMap: { [key: string]: MovementNode } = {};

	const originalTopCoordinate = isFirst
		? topCoordinate
		: originalCoordinates!.top;
	const originalLeftCoordinate = isFirst
		? leftCoordinate
		: originalCoordinates!.left;

	Object.values(Direction).forEach(direction => {
		let newTopCoordinate = topCoordinate;
		let newLeftCoordinate = leftCoordinate;

		switch (direction) {
			case Direction.LEFT:
				newLeftCoordinate -= 1;
				break;
			case Direction.UP:
				newTopCoordinate -= 1;
				break;
			case Direction.RIGHT:
				newLeftCoordinate += 1;
				break;
			case Direction.DOWN:
				newTopCoordinate += 1;
				break;
			default:
				break;
		}
		const score = generateScore(
			newTopCoordinate,
			newLeftCoordinate,
			{ top: originalTopCoordinate, left: originalLeftCoordinate },
			gameMap
		);

		playerMovementMap[direction] = {
			topCoordinate: newTopCoordinate,
			leftCoordinate: newLeftCoordinate,
			score,
		};
		if (level > 0 && !!score) {
			playerMovementMap[direction] = {
				...playerMovementMap[direction],
				...{
					child: generateMovementTree(
						newTopCoordinate,
						newLeftCoordinate,
						gameMap,
						level - 1,
						false,
						{
							top: originalTopCoordinate,
							left: originalLeftCoordinate,
						}
					),
				},
			};
		}
	});

	return playerMovementMap;
};

const calculateTotalScoreForBranch = (
	branchKey: string,
	branchValue: MovementNode
): number | null => {
	let totalScore: number | null = null;
	if (branchValue.score === undefined) {
		return totalScore;
	}
	totalScore = branchValue.score;
	return totalScore;
};

const findBestMove = (
	topCoordinate: number,
	leftCoordinate: number,
	gameMap: GameMap
): TopLeftCoordinates => {
	const movementTree = generateMovementTree(
		topCoordinate,
		leftCoordinate,
		gameMap
	);
	console.log(movementTree);

	let bestMovementNode: MovementNode | null = null;
	let bestScore: number | null = null;

	Object.entries(movementTree).forEach(
		([movementNodeKey, movementNodeValue]) => {
			const branchScore = calculateTotalScoreForBranch(
				movementNodeKey,
				movementNodeValue
			);
			if (!bestScore || (branchScore && bestScore < branchScore)) {
				bestScore = branchScore;
				bestMovementNode = movementNodeValue;
			}
		}
	);
	if (!bestMovementNode) {
		return { top: topCoordinate, left: leftCoordinate };
	}

	console.log(bestMovementNode);
	return {
		top: bestMovementNode!.topCoordinate * 32,
		left: bestMovementNode!.leftCoordinate * 32,
	};
};

type NPCActionProps = {
	players: Players;
	gameMap: GameMap;
	onMove: OnMove;
	addBomb: AddBomb;
};
type NPCAction = (props: NPCActionProps) => void;
const npcAction: NPCAction = ({ players, gameMap, onMove }) => {
	const currentPlayerId = Player.P3;
	const currentPlayer = players[currentPlayerId];

	if (!currentPlayer) {
		return;
	}

	const currentPlayerTop: number =
		currentPlayer.coordinates.top / config.size.character;
	const currentPlayerLeft: number =
		currentPlayer.coordinates.left / config.size.character;

	const bestMoveCoordinates = findBestMove(
		currentPlayerTop,
		currentPlayerLeft,
		gameMap
	);

	onMove(currentPlayerId, bestMoveCoordinates);

	// Move to another file later
};

export type { NPCAction };
export {
	generateRandomGameMap,
	canMove,
	rotateMove,
	handleRotateMove,
	resetRotation,
	CUBE_BASE_TRANSFORM,
	getExplosionScaleSize,
	handleExplosionOnGameMap,
	playerGenerator,
	npcAction,
};
