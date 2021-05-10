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
	// #region Shared
	export type MovementSpedDefaultValue = 200 | 150 | 100;
	export type MovementSpedIncreaseValue = -10 | -15 | -20 | -25 | -30;
	// #endregion
	// #region GameConfig.powerUps
	export type PowerUpChance = RangeOf<5, 1>;
	export type PowerUpDefaults = Record<
		Exclude<PowerUp, PowerUp.MovementSpeed>,
		RangeOf<5, 1>
	> &
		Record<PowerUp.MovementSpeed, MovementSpedDefaultValue>;
	export type PowerUpIncreaseValues = Record<
		Exclude<PowerUp, PowerUp.MovementSpeed>,
		RangeOf<3, 1>
	> &
		Record<PowerUp.MovementSpeed, MovementSpedIncreaseValue>;
	export type PowerUpMaxDropCount = Record<PowerUp, RangeOf<6, 1>>;
	// #endregion
	// #region GameConfig.tiles
	export type BlockTileChance = RangeOf<10, 1>;
	// #endregion
	// #region GameConfig.sizes
	export type MapSize = RangeOf<15, 6>;
	export type SquareSize = 32 | 48 | 64; // | 64 ?
	// TODO: This wont' be a square movement in the future
	export type MovementSize = 32 | 48 | 64; // will be pixellated
	// #endregion
	// #region GameConfig.duration
	export type FiringDuration = 1.5 | 2.5 | RangeOf<3, 1>;
	export type ExplodingDuration = 0.5 | 1 | 1.5;
	// #endregion
}

type GameConfig = {
	powerUps: {
		/** Chance of getting a PowerUp */
		chance: GameConfigRanges.PowerUpChance;
		/** Default values each player start with */
		defaults: GameConfigRanges.PowerUpDefaults;
		/** Increase in value per PowerUp */
		increaseValues: GameConfigRanges.PowerUpIncreaseValues;
		/** Maximum number of times a PowerUp can drop */
		maxDropCount: GameConfigRanges.PowerUpMaxDropCount;
	};
	tiles: {
		/** Chance of getting Tile.Breaking or Tile.NonBreaking  */
		blockTileChance: GameConfigRanges.BlockTileChance;
	};
	sizes: {
		/** Edge length of the square map */
		map: GameConfigRanges.MapSize; // squares
		/** Size of the character, should be < size.tile */
		character: GameConfigRanges.SquareSize; // px
		/** Size of the tile */
		tile: GameConfigRanges.SquareSize; // px
		/** Movement size */
		movement: GameConfigRanges.MovementSize; // px
	};
	// TODO: pluralize this
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
	bombs: Bombs;
	// null for when it's picked up
	powerUps: Record<number, Record<number, PowerUp | null>>;
	config: GameConfig;
	is3D: boolean;
	isSideView: boolean;
	animationCounter: AnimationCounter;
};
// }>;

type Bombs = Record<string, Bomb>;

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
	Bombs,
	AnimatableGameMap,
	GameConfigRanges,
	GameConfig,
};
