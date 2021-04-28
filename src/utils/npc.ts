import config from 'config';
import {
	GameMap,
	NPCActionProps,
	OnDropBomb,
	TopLeftCoordinates,
} from 'containers/Game/types';
import { Direction, Explosive, Player, PowerUp, Tile } from 'enums';
import { MAX_GAME_SIZE, MIN_GAME_SIZE } from 'utils/game';
import { getRandomInt } from './math';

let id: number = 0;
let parentNodes: MovementNode[] = [];
let dropBombTest: OnDropBomb;

let bombCoordinates: TopLeftCoordinates[] = [];

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

const canBombsReach = ({
	top: newTopCoordinate,
	left: newLeftCoordinate,
}: TopLeftCoordinates): boolean => {
	if (bombCoordinates.length === 0) {
		return false;
	}

	console.log(bombCoordinates);
	let canBombExplosionReach = false;
	bombCoordinates.forEach(bombCoordinate => {
		canBombExplosionReach =
			canBombExplosionReach ||
			(newLeftCoordinate === bombCoordinate.left &&
				(newTopCoordinate <= bombCoordinate.top + 2 ||
					newTopCoordinate >= bombCoordinate.top - 2)) ||
			// directly left or right. Same idea as above but for +1 left coordinate
			(newTopCoordinate === bombCoordinate.top &&
				(newLeftCoordinate <= bombCoordinate.left + 2 ||
					newLeftCoordinate >= bombCoordinate.left - 2));
	});

	console.log({
		top: newTopCoordinate,
		left: newLeftCoordinate,
	});
	console.log(canBombExplosionReach);
	return canBombExplosionReach;
};

const generateScore = (
	{ top: topCoordinate, left: leftCoordinate }: TopLeftCoordinates,
	originalCoordinates: TopLeftCoordinates,
	gameMap: GameMap,
	level: number
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

	if (square === Explosive.Bomb) {
		bombCoordinates.push({ top: topCoordinate, left: leftCoordinate });
	}

	if (canBombsReach({ top: topCoordinate, left: leftCoordinate })) {
		return -10000;
	}

	if (Object.values(PowerUp).includes(square as PowerUp)) {
		return 1000 * level;
	}

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
		if (
			isAdjacent(
				{ top: topCoordinate, left: leftCoordinate },
				originalCoordinates
			)
		) {
			const currentTime = new Date().getTime();
			if (lastBombTime <= currentTime - BOMB_DURATION * 1000) {
				dropBombTest(Player.P4);
				lastBombTime = currentTime;
			}
			return -100;
		}
		if (
			topCoordinate !== originalCoordinates.top ||
			leftCoordinate !== originalCoordinates.left
		) {
			return 3;
		}
	}
	if (square === Tile.NonBreaking) {
		if (
			isAdjacent(
				{ top: topCoordinate, left: leftCoordinate },
				originalCoordinates
			)
		) {
			return -100;
		}
		return -5;
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
			gameMap,
			level
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
		let retVal = current;
		if (current.score === undefined) {
			retVal = acc;
		}

		if (acc.score! > current.score!) {
			retVal = acc;
		}
		if (acc.score! < current.score!) {
			retVal = current;
		}
		if (acc.score === current.score) {
			const randomInt = getRandomInt(2);
			retVal = randomInt === 0 ? current : acc;
		}

		return retVal;
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

	if (parentId !== null) {
		if (parentId === undefined) {
			validMovementNodes = Object.values(movementTree).filter(
				movementNode => !movementNode.hasChildren
			);
		} else {
			validMovementNodes = Object.values(movementTree).filter(
				movementNode =>
					movementNode.parentId === movementTree[parentId!].parentId
			);
		}

		const movementNodesGroupedByParentId = groupMovementNodesByParentId(
			validMovementNodes!
		);

		Object.entries(movementNodesGroupedByParentId).forEach(
			([groupParentId, movementNodes]) => {
				const _groupParentId =
					groupParentId === 'null' ? null : Number(groupParentId);

				const nodeWithHighestScore = findNodeWithHighestScore(
					movementNodes!
				);

				if (!_groupParentId) {
					if (
						!parentNodes.some(
							parentNode =>
								parentNode.direction ===
								nodeWithHighestScore.direction
						)
					)
						parentNodes.push(nodeWithHighestScore);
				} else {
					// eslint-disable-next-line no-param-reassign
					movementTree[_groupParentId].score =
						movementTree[_groupParentId].score! +
						(nodeWithHighestScore.score!
							? nodeWithHighestScore.score
							: 0);
					getTotalScoreOfAllNodes(movementTree, _groupParentId);
				}
			}
		);
	}
};

const findBestMove = (
	topLeftCoordinates: TopLeftCoordinates,
	gameMap: GameMap
): MovementNode | null => {
	id = 0;
	parentNodes = [];
	bombCoordinates = [];
	const movementTree = generateMovementTree(
		topLeftCoordinates,
		gameMap,
		undefined,
		{ top: topLeftCoordinates.top, left: topLeftCoordinates.left }
	);

	getTotalScoreOfAllNodes(movementTree);
	console.log(movementTree);
	console.log(parentNodes);

	return findNodeWithHighestScore(parentNodes);
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
	debugger;
};

export type { NPCAction };
export { npcAction };
