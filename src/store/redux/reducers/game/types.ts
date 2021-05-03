// import { Immutable } from 'immer';
import {
	GameMap,
	NonNullablePlayerRef,
	PlayerId,
	PlayerKeyboardConfig,
	Players,
	SquareCoordinates,
	TopLeftCoordinates,
} from 'containers/Game/types';
import { Direction, PowerUp } from 'enums';
import * as constants from './constants';

const { KEY, DEFAULT_VALUES, ...actionTypes } = constants;

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

type BombFn = (bombId: BombId, cb?: CallableFunction) => void;

/** Square coordinates that can break tiles and kill players. */
type BombExplosionSquareCoordinates = Array<SquareCoordinates>;

namespace GameConfigRanges {
	export type SquareSize = 32; // | 64 ?
	// TODO: This wont' be a square movement in the future
	export type MovementSize = 32; // will be pixellated
	export type MovementSpedDefaultValue = 200 | 150 | 100;
	export type MovementSpedIncreaseValue = -10 | -15 | -20 | -25 | -30;
	export type FiringDuration = 0.5 | 0.75 | 1.5 | 2.5 | RangeOf<3, 1>;
	export type ExplodingDuration = 0.5 | 1 | 1.5;
	export type MapSize = RangeOf<15, 6>;
}
// const a: GameConfig = {
// 	game: {
// 		powerUps: {
// 			increaseValues: {},
// 		},
// 	},
// };

type GameConfig = {
	game: {
		powerUps: {
			/** Chance of getting a PowerUp */
			chance: RangeOf<5, 1>;
			/** Default values each player start with */
			defaults: Record<
				Exclude<PowerUp, PowerUp.MovementSpeed>,
				RangeOf<5, 1>
			> &
				Record<
					PowerUp.MovementSpeed,
					GameConfigRanges.MovementSpedDefaultValue
				>;
			/** Increase in value per PowerUp */
			increaseValues: Record<
				Exclude<PowerUp, PowerUp.MovementSpeed>,
				RangeOf<3, 1>
			> &
				Record<
					PowerUp.MovementSpeed,
					GameConfigRanges.MovementSpedIncreaseValue
				>;
			/** Maximum number of times a PowerUp can drop */
			maxDropCount: Record<PowerUp, RangeOf<6, 1>>;
		};
		/** Edge length of the square map */
		mapSize: GameConfigRanges.MapSize; // squares
	};
	random: {
		/** Chance of getting Tile.Breaking or Tile.NonBreaking  */
		blockDensity: RangeOf<10, 1>;
	};
	size: {
		/** Size of the character, should be < size.tile */
		character: GameConfigRanges.SquareSize; // px
		/** Size of the tile */
		tile: GameConfigRanges.SquareSize; // px
		/** Movement size */
		movement: GameConfigRanges.MovementSize; // px
		/** Bomb size */
		readonly bomb: 16; // px
	};
	duration: {
		bomb: {
			/** Duration before bomb explodes */
			firing: GameConfigRanges.FiringDuration; // second
			/** Duration of the explosion (fire) */
			exploding: GameConfigRanges.ExplodingDuration; // second
		};
	};
	keyboardConfig: Partial<Record<PlayerId, PlayerKeyboardConfig>>;
};

// type GameState = Immutable<{
type GameState = {
	players: Players;
	gameMap: GameMap;
	bombs: Record<string, Bomb>;
	// null for when it's picked up
	powerUps: Record<number, Record<number, PowerUp | null>>;
	config: GameConfig;
	is3D: boolean;
	isSideView: boolean;
	// TODO: rename to gameSize
	size: RangeOf<15, 6>;
	animationCounter: AnimationCounter;
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
	| OnMoveProps
	| OnPrepareMoveProps;

type GameAction = {
	type: ValuesOf<typeof actionTypes>;
	payload?: GamePayload;
	cb?: CallableFunction;
};

type BombId = string;

type OnExplosionComplete = (bombId: BombId) => void;

type GameActionFn = (payload?: GamePayload, cb?: CallableFunction) => void;

/** Triggers a move */
type OnPrepareMoveProps = {
	playerId: PlayerId;
	direction: Direction;
	onComplete: OnMove;
	// TODO: Eventually move into the store
	ref: NonNullablePlayerRef;
};

type OnTriggerMove = (props: Omit<OnPrepareMoveProps, 'onComplete'>) => void;

/** Makes the actual move */
type OnMoveProps = {
	playerId: PlayerId;
	newCoordinates: TopLeftCoordinates;
};

type OnMove = (props: OnMoveProps) => void;

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
	GameConfigRanges,
	GameConfig,
};
