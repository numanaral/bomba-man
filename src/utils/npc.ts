import config from 'config';
import {
	AddBomb,
	GameMap,
	NPCActionProps,
	TopLeftCoordinates,
} from 'containers/Game/types';
import { Direction, Player, Tile } from 'enums';
import { MAX_GAME_SIZE, MIN_GAME_SIZE } from 'utils/game';
import { getRandomInt } from './math';

let id: number = 0;
let parentNodes: MovementNode[] = [];
let dropBombTest: AddBomb;

let lastBombTime = 0;
const BOMB_DURATION =
	config.duration.bomb.firing + config.duration.bomb.exploding;

// let immediateStop = false;

type Score = number | undefined;

type MovementNode = {
	score: Score;
	parentId: number | null;
	hasChildren: boolean;
	direction: Direction;
	level: number;
};

type MovementNodeWithKey = {
	[key: number]: MovementNode;
};

const isAdjacent = (
	{ top: newTopCoordinate, left: newLeftCoordinate }: TopLeftCoordinates,
	{
		top: originalTopCoordinate,
		left: originalLeftCoordinate,
	}: TopLeftCoordinates
) => {
	return (
		// Directly top or below. If left coordinate is the same and it is +-1 top coordinate
		// Place a bomb
		(newLeftCoordinate === originalLeftCoordinate &&
			(newTopCoordinate === originalTopCoordinate + 1 ||
				newTopCoordinate === originalTopCoordinate - 1)) ||
		// directly left or right. Same idea as above but for +1 left coordinate
		(newTopCoordinate === originalTopCoordinate &&
			(newLeftCoordinate === originalLeftCoordinate + 1 ||
				newLeftCoordinate === originalLeftCoordinate - 1))
	);
};

const generateScore = (
	{ top: topCoordinate, left: leftCoordinate }: TopLeftCoordinates,
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
		return 2;
	}
	if (square === Tile.Breaking) {
		console.log('hereeee');
		if (
			isAdjacent(
				{ top: topCoordinate, left: leftCoordinate },
				originalCoordinates
			)
		) {
			const currentTime = new Date().getTime();
			if (lastBombTime <= currentTime - BOMB_DURATION * 1000) {
				dropBombTest({
					top: originalCoordinates.top * config.size.movement,
					left: originalCoordinates.left * config.size.movement,
				});
				// immediateStop = false;
				lastBombTime = currentTime;
			}
			// if (!immediateStop) {
			// 	immediateStop = true;
			// 	return -1000;
			// }

			console.log('Adjacent');
			return 0;
		}
		if (
			topCoordinate !== originalCoordinates.top ||
			leftCoordinate !== originalCoordinates.left
		) {
			console.log('here');
			return 2;
		}
	}
	if (square === Tile.NonBreaking) {
		return undefined;
	}

	return 0;
};

const generateMovementTree = (
	topLeftCoordinates: TopLeftCoordinates,
	gameMap: GameMap,
	level: number = 2,
	originalCoordinates: TopLeftCoordinates,
	parentId: number | null = null
) => {
	let playerMovementTree: MovementNodeWithKey = {};

	Object.values(Direction).forEach(direction => {
		let newTopCoordinate = topLeftCoordinates.top;
		let newLeftCoordinate = topLeftCoordinates.left;

		id += 1;

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
			{ top: newTopCoordinate, left: newLeftCoordinate },
			{ top: originalCoordinates.top, left: originalCoordinates.left },
			gameMap
		);

		playerMovementTree[id] = {
			score,
			hasChildren: level > 0 && score !== undefined,
			parentId,
			direction,
			level,
		};
		if (level > 0 && !!score) {
			playerMovementTree = {
				...playerMovementTree,
				...generateMovementTree(
					{ top: newTopCoordinate, left: newLeftCoordinate },
					gameMap,
					level - 1,
					originalCoordinates,
					id
				),
			};
		}
	});

	return playerMovementTree!;
};

const findNodeWithHighestScore = (movementNodes: MovementNode[]) => {
	return movementNodes.reduce((acc, current) => {
		return acc.score! > current.score! ? acc : current;
	});
};

const groupMovementNodesByParentId = (movementNodes: MovementNode[]) => {
	const movementNodesGroupedById: { [key: number]: MovementNode[] } = {};

	movementNodes.forEach(movementNode => {
		const movementNodeParentId = movementNode.parentId!;
		if (movementNodesGroupedById[movementNodeParentId]) {
			movementNodesGroupedById[movementNodeParentId].push(movementNode);
		} else {
			movementNodesGroupedById[movementNodeParentId] = [movementNode];
		}
	});
	return movementNodesGroupedById;
};

const getTotalScoreOfAllNodes = (
	movementTree: MovementNodeWithKey,
	parentId: number | undefined | null = undefined
) => {
	let validMovementNodes: MovementNode[];
	if (parentId === null) {
		return;
	}
	if (parentId === undefined) {
		validMovementNodes = Object.values(movementTree).filter(
			movementNode =>
				!movementNode.hasChildren && movementNode.score !== undefined
		);
	} else {
		validMovementNodes = Object.values(movementTree).filter(
			movementNode =>
				movementNode.parentId === movementTree[parentId].parentId &&
				movementNode.score !== undefined
		);
	}

	const movementNodesGroupedByParentId = groupMovementNodesByParentId(
		validMovementNodes
	);

	Object.entries(movementNodesGroupedByParentId).forEach(
		([groupParentId, movementNodes]) => {
			const _groupParentId =
				groupParentId === 'null' ? null : Number(groupParentId);

			const nodeWithHighestScore = findNodeWithHighestScore(
				movementNodes!
			);

			if (!_groupParentId) {
				parentNodes.push(nodeWithHighestScore);
			} else {
				// eslint-disable-next-line no-param-reassign
				movementTree[_groupParentId].score =
					movementTree[_groupParentId].score! +
					nodeWithHighestScore.score!;
				getTotalScoreOfAllNodes(movementTree, _groupParentId);
			}
		}
	);
};

const findBestMove = (
	topLeftCoordinates: TopLeftCoordinates,
	gameMap: GameMap
): MovementNode | null => {
	id = 0;
	parentNodes = [];
	const movementTree = generateMovementTree(
		topLeftCoordinates,
		gameMap,
		undefined,
		{ top: topLeftCoordinates.top, left: topLeftCoordinates.left }
	);

	console.log(movementTree);

	getTotalScoreOfAllNodes(movementTree);

	console.log(parentNodes);

	return parentNodes[getRandomInt(parentNodes.length)];
};

type NPCAction = (props: NPCActionProps) => void;
const npcAction: NPCAction = ({ players, gameMap, triggerMove, dropBomb }) => {
	const playerId = Player.P4;
	const currentPlayer = players[playerId];

	dropBombTest = dropBomb;

	if (!currentPlayer) {
		return;
	}

	const currentPlayerTop: number =
		currentPlayer.coordinates.top / config.size.character;
	const currentPlayerLeft: number =
		currentPlayer.coordinates.left / config.size.character;

	const bestMovementNode = findBestMove(
		{ top: currentPlayerTop, left: currentPlayerLeft },
		gameMap
	);

	if (
		bestMovementNode &&
		bestMovementNode.score &&
		bestMovementNode.score > 0
	) {
		triggerMove({ playerId, direction: bestMovementNode.direction });
	}
};

export type { NPCAction };
export { npcAction };
