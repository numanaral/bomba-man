// import { Immutable } from 'immer';
import {
	GameMap,
	PlayerId,
	PlayerRef,
	Players,
	SquareCoordinates,
	TopLeftCoordinates,
} from 'containers/Game/types';
import { Direction } from 'enums';
import * as constants from './constants';

const { KEY, DEFAULT_VALUES, PLAYERS, ...actionTypes } = constants;

// TODO: merge types?

/**
 * Change in this index triggers animation. This is needed in order to prevent
 * animations when switching perspective (i.e. 2D -> 3D).
 */
type AnimationCounter = number;

type Bomb = {
	id: string;
	playerId: PlayerId;
	explosionSize: number;
} & TopLeftCoordinates;

type BombFn = (bombId: BombId) => void;

/** Square coordinates that can break tiles and kill players. */
type BombExplosionSquareCoordinates = Array<SquareCoordinates>;

// type GameState = Immutable<{
type GameState = {
	players: Players;
	gameMap: GameMap;
	is3D: boolean;
	isSideView: boolean;
	size: RangeOf<15>;
	animationCounter: AnimationCounter;
	bombs: Array<Bomb>;
};
// }>;

type AnimatableGameMap = {
	gameMap: GameMap;
	animate?: boolean;
};

type GamePayload =
	| GameState
	| ValuesOf<GameState>
	| BombId
	| AnimatableGameMap
	| PlayerWithNewRef
	| OnMoveProps
	| OnPrepareMoveProps;

type GameAction = {
	type: ValuesOf<typeof actionTypes>;
	payload?: GamePayload;
};

type BombId = string;

type OnExplosionComplete = (bombId: BombId) => void;

type GameActionFn = (payload?: GamePayload) => void;

/** Triggers a move */
type OnPrepareMoveProps = {
	playerId: PlayerId;
	direction: Direction;
	onComplete: OnMove;
};

type OnTriggerMove = (props: Omit<OnPrepareMoveProps, 'onComplete'>) => void;

/** Makes the actual move */
type OnMoveProps = {
	playerId: PlayerId;
	newCoordinates: TopLeftCoordinates;
};

type OnMove = (props: OnMoveProps) => void;

type PlayerWithNewRef = {
	playerId: PlayerId;
	newRef: NonNullable<PlayerRef>;
};

export type {
	Bomb,
	BombFn,
	BombExplosionSquareCoordinates,
	GameState,
	GamePayload,
	GameAction,
	GameActionFn,
	OnPrepareMoveProps,
	OnTriggerMove,
	OnMoveProps,
	OnMove,
	BombId,
	OnExplosionComplete,
	AnimatableGameMap,
	PlayerWithNewRef,
};
