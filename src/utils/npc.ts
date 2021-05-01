import config from 'config';
import {
	GameMap,
	NPCActionProps,
	TopLeftCoordinates,
} from 'containers/Game/types';
import { Direction, Player, Tile } from 'enums';
import { MAX_GAME_SIZE, MIN_GAME_SIZE } from 'utils/game';

type Score = number | undefined;

type MovementNode = {
	topCoordinate: number;
	leftCoordinate: number;
	score: Score;
	child?: MovementNodeDirections;
};

type MovementNodeDirections = {
	[value in Direction]?: MovementNode;
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
	const playerMovementTree: MovementNodeDirections = {};

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

		playerMovementTree[direction] = {
			topCoordinate: newTopCoordinate,
			leftCoordinate: newLeftCoordinate,
			score,
		};
		if (level > 0 && !!score) {
			playerMovementTree[direction] = {
				...playerMovementTree[direction]!,
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

	return playerMovementTree!;
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
): Direction | null => {
	const movementTree = generateMovementTree(
		topCoordinate,
		leftCoordinate,
		gameMap
	);

	let bestMovementNode: MovementNode | null = null;
	let bestMovementDirection: Direction;
	let bestScore: number | null = null;

	Object.entries(movementTree).forEach(
		([movementNodeKey, movementNodeValue]) => {
			const branchScore = calculateTotalScoreForBranch(
				movementNodeKey,
				movementNodeValue!
			);
			if (!bestScore || (branchScore && bestScore < branchScore)) {
				bestScore = branchScore;
				bestMovementNode = movementNodeValue!;
				bestMovementDirection = movementNodeKey as Direction;
			}
		}
	);
	if (!bestMovementNode) {
		return null;
	}

	return bestMovementDirection!;
};

type NPCAction = (props: NPCActionProps) => void;
const npcAction: NPCAction = ({ players, gameMap, triggerMove, ref }) => {
	const playerId = Player.P4;
	const currentPlayer = players[playerId];

	if (!currentPlayer) {
		return;
	}

	const currentPlayerTop: number =
		currentPlayer.coordinates.top / config.size.character;
	const currentPlayerLeft: number =
		currentPlayer.coordinates.left / config.size.character;

	const bestMovementDirection = findBestMove(
		currentPlayerTop,
		currentPlayerLeft,
		gameMap
	);

	if (bestMovementDirection) {
		triggerMove({ playerId, direction: bestMovementDirection, ref });
	}

	// TODO: Move to another file later
};

export type { NPCAction };
export { npcAction };
