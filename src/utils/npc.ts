import {
	GameMap,
	NPCActionFn,
	Square,
	SquareCoordinates,
} from 'containers/Game/types';
import { Direction, Explosive, Player, PowerUp, Tile } from 'enums';
import { GameConfig } from 'store/redux/reducers/game/types';
import {
	getSquareCoordinatesFromSquareOrTopLeftCoordinates,
	isSquareOutOfBoundaries,
} from './game';
import { getRandomInt } from './math';

type NpcStore = {
	id: number;
	parentNodes: MovementNode[];
	bombCoordinates: SquareCoordinates[];
	lastBombTime: number;
	dropBomb: () => void;
	gameMap: GameMap;
	sizes: GameConfig['sizes'];
	bombDuration: GameConfig['duration']['bomb'];
} | null;
let Store: NpcStore;

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

const isDifferentSquare = (
	newCoordinates: SquareCoordinates,
	oldCoordinates: SquareCoordinates
) => {
	const { ySquare: newYSquare, xSquare: newXSquare } = newCoordinates;
	const { ySquare: oldYSquare, xSquare: oldXSquare } = oldCoordinates;

	return newYSquare !== oldYSquare || newXSquare !== oldXSquare;
};

const isSquareAPlayer = (square: Square) => {
	return Object.values<Square>(Player).includes(square);
};

const isAdjacent = (
	{ ySquare: newYSquare, xSquare: newXSquare }: SquareCoordinates,
	{ ySquare: oldYSquare, xSquare: oldXSquare }: SquareCoordinates
) => {
	return (
		// Directly top or below. If left coordinate is the same and it is +-1 top coordinate
		// Place a bomb
		(newXSquare === oldXSquare &&
			(newYSquare === oldYSquare + 1 || newYSquare === oldYSquare - 1)) ||
		// directly left or right. Same idea as above but for +1 left coordinate
		(newYSquare === oldYSquare &&
			(newXSquare === oldXSquare + 1 || newXSquare === oldXSquare - 1))
	);
};

const dropBombAndRunOrScoreTarget = (
	newCoordinates: SquareCoordinates,
	oldCoordinates: SquareCoordinates,
	targetScore: Score,
	runScore?: -100
) => {
	// TODO: is this necessary? it's already the nextSquare
	if (isAdjacent(newCoordinates, oldCoordinates)) {
		const currentTime = new Date().getTime();
		if (
			Store!.lastBombTime <=
			currentTime -
				Object.values(Store!.bombDuration).reduce(
					(acc, duration) => acc + duration,
					0
				) *
					1000
		) {
			Store!.dropBomb();
			Store!.lastBombTime = currentTime;
		}
		return runScore;
	}
	if (isDifferentSquare(newCoordinates, oldCoordinates)) {
		return targetScore;
	}

	return null;
};

const canBombsReach = ({ ySquare, xSquare }: SquareCoordinates): boolean => {
	if (Store!.bombCoordinates.length === 0) {
		return false;
	}

	let canBombExplosionReach = false;
	Store!.bombCoordinates.forEach(bombCoordinate => {
		canBombExplosionReach =
			canBombExplosionReach ||
			(xSquare === bombCoordinate.xSquare &&
				(ySquare <= bombCoordinate.ySquare + 2 ||
					ySquare >= bombCoordinate.ySquare - 2)) ||
			// directly left or right. Same idea as above but for +1 left coordinate
			(ySquare === bombCoordinate.ySquare &&
				(xSquare <= bombCoordinate.xSquare + 2 ||
					xSquare >= bombCoordinate.xSquare - 2));
	});

	return canBombExplosionReach;
};

const generateScore = (
	newCoordinates: SquareCoordinates,
	oldCoordinates: SquareCoordinates,
	level: number
): number | undefined => {
	const { ySquare: newYSquare, xSquare: newXSquare } = newCoordinates;
	const { ySquare: oldYSquare, xSquare: oldXSquare } = oldCoordinates;

	if (isSquareOutOfBoundaries(newCoordinates, Store!.sizes.map)) {
		return undefined;
	}

	const newSquare = Store!.gameMap[newYSquare][newXSquare];
	// TODO: Please comment
	if (newSquare === Explosive.Bomb) {
		Store!.bombCoordinates.push(newCoordinates);
	}
	if (canBombsReach(newCoordinates)) {
		return -10000;
	}
	if (Object.values(PowerUp).includes(newSquare as PowerUp)) {
		return 1000 * level;
	}
	if (newYSquare === oldYSquare && newXSquare === oldXSquare) {
		return 0;
	}
	if (newSquare === Tile.Empty) {
		return 2;
	}
	if (isSquareAPlayer(newSquare)) {
		const score = dropBombAndRunOrScoreTarget(
			newCoordinates,
			oldCoordinates,
			4
		);
		if (score !== null) return score;
	}
	if (newSquare === Tile.Breaking) {
		const score = dropBombAndRunOrScoreTarget(
			newCoordinates,
			oldCoordinates,
			3
		);
		if (score !== null) return score;
	}
	if (newSquare === Tile.NonBreaking) {
		// TODO: is this necessary? it's already the nextSquare
		if (isAdjacent(newCoordinates, oldCoordinates)) {
			return -100;
		}
		return -5;
	}

	return 0;
};

const generateMovementTree = (
	newCoordinates: SquareCoordinates,
	oldCoordinates: SquareCoordinates,
	level: number = 2,
	parentId: number | null = null
) => {
	const { ySquare: newYSquare, xSquare: newXSquare } = newCoordinates;
	let playerMovementTree: MovementNodeWithKey = {};

	Object.values(Direction).forEach(direction => {
		let _newYSquare = newYSquare;
		let _newXSquare = newXSquare;

		Store!.id++;

		switch (direction) {
			case Direction.LEFT:
				_newXSquare--;
				break;
			case Direction.UP:
				_newYSquare--;
				break;
			case Direction.RIGHT:
				_newXSquare++;
				break;
			case Direction.DOWN:
				_newYSquare++;
				break;
			default:
				break;
		}
		const score = generateScore(
			{ ySquare: _newYSquare, xSquare: _newXSquare },
			oldCoordinates,
			level
		);

		playerMovementTree[Store!.id] = {
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
					{ ySquare: _newYSquare, xSquare: _newXSquare },
					oldCoordinates,
					level - 1,
					Store!.id
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
						!Store!.parentNodes.some(
							parentNode =>
								parentNode.direction ===
								nodeWithHighestScore.direction
						)
					) {
						Store!.parentNodes.push(nodeWithHighestScore);
					}
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
	currentCoordinates: SquareCoordinates
): MovementNode | null => {
	Store!.id = 0;
	Store!.parentNodes = [];
	Store!.bombCoordinates = [];

	const movementTree = generateMovementTree(
		currentCoordinates,
		currentCoordinates,
		undefined
	);
	getTotalScoreOfAllNodes(movementTree);

	return findNodeWithHighestScore(Store!.parentNodes);
};

const npcAction: NPCActionFn = ({
	playerId,
	players,
	gameMap,
	triggerMove,
	dropBomb,
	ref,
	sizes,
	bombDuration,
}) => {
	const currentPlayer = players[playerId];
	Store = {
		id: 0,
		parentNodes: [],
		bombCoordinates: [],
		lastBombTime: 0,
		dropBomb: () => dropBomb(playerId),
		gameMap,
		sizes,
		bombDuration,
	};

	if (!currentPlayer) return;

	// eslint-disable-next-line max-len
	const currentSquareCoordinates = getSquareCoordinatesFromSquareOrTopLeftCoordinates(
		currentPlayer.coordinates,
		sizes.movement
	);

	const bestMovementNode = findBestMove(currentSquareCoordinates);

	if ((bestMovementNode?.score || 0) > 0) {
		triggerMove({ playerId, direction: bestMovementNode!.direction, ref });
	}
};

export { npcAction };
