// import { Immutable } from 'immer';
import {
	GameMap,
	PlayerId,
	Players,
	TopLeftCoordinates,
} from 'containers/Game/types';
import * as constants from './constants';

const { KEY, DEFAULT_VALUES, PLAYERS, ...actionTypes } = constants;

/**
 * Change in this index triggers animation. This is needed in order to prevent
 * animations when switching perspective (i.e. 2D -> 3D).
 */
type AnimationCounter = number;

type Bomb = {
	id: string;
	playerId?: PlayerId;
} & TopLeftCoordinates;

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
	| OnExplosionProps
	| BombId
	| AnimatableGameMap
	| PlayerWithNewRef;

type GameAction = {
	type: ValuesOf<typeof actionTypes>;
	payload?: GamePayload;
};

type OnExplosionProps = {
	bombId: string;
	bombCoordinates: TopLeftCoordinates;
};

type OnExplosion = (props: OnExplosionProps) => void;

type BombId = string;

type OnExplosionComplete = (bombId: BombId) => void;

type GameActionFn = (payload?: GamePayload) => void;

type OnMoveProps = {
	playerId: PlayerId;
	newCoordinates: TopLeftCoordinates;
};

type OnMove = (props: OnMoveProps) => void;

type PlayerWithNewRef = {
	playerId: PlayerId;
	newRef: HTMLDivElement;
};

export type {
	Bomb,
	GameState,
	GamePayload,
	GameAction,
	GameActionFn,
	OnExplosionProps,
	OnExplosion,
	OnMoveProps,
	OnMove,
	BombId,
	OnExplosionComplete,
	AnimatableGameMap,
	PlayerWithNewRef,
};
