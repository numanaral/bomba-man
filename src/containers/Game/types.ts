import {
	Direction,
	Player,
	PowerUp,
	Tile,
	Explosive,
	GameType,
	GameEndCondition,
	PlayerCondition,
} from 'enums';
import * as KeyCode from 'keycode-js';
import {
	Bombs,
	GameConfig,
	GameState,
	OnTriggerMove,
} from 'store/redux/reducers/game/types';
import { FontAwesomeIconProps as FontAwesomeBaseIconProps } from '@fortawesome/react-fontawesome';
import { GameProvider } from 'store/redux/hooks/useGameProvider';
import { PlayerDisplayProps } from 'containers/WaitingRoom/PlayerDisplay';

// import { Immutable } from 'immer';

type CollisionCoordinates = {
	[key: number]: number;
};

interface TileProps extends React.HTMLAttributes<HTMLDivElement> {
	size: number;
	top: number;
	left: number;
	variant: Square;
	color?: string;
	collisionIndex?: number;
	animate?: boolean;
	fireSquare?: Fire;
}

type Fire =
	| Explosive.FireCore
	| Explosive.FireHorizontal
	| Explosive.FireVertical;

type TopLeftCoordinates = {
	top: number;
	left: number;
};

type SquareCoordinates = {
	xSquare: number;
	ySquare: number;
};

type Coordinates = TopLeftCoordinates | SquareCoordinates;

type OnDropBomb = (playerId: PlayerId) => void;

type Square = Player | Tile | PowerUp | Explosive;

// type GameMap = Immutable<Array<Array<Square>>>;
type GameMap = Record<string, Record<string, Square>>;

type KeyboardEventCode = ValuesOf<typeof KeyCode>;

// TODO: group types into separate folders/files

// #region Character Config Types
// TODO: Maybe convert these to enums?
type MovementActionKeys = `Move${Direction}`;
type CharacterActionKeys = 'DropBomb'; // | 'Jump';
type PlayerActionKeys = MovementActionKeys | CharacterActionKeys;
type PlayerKeyboardConfig = Record<PlayerActionKeys, KeyboardEventCode>;

type PlayerId = `P${RangeOf<4, 1>}`;

// #endregion

type Players = {
	[key in PlayerId]?: PlayerConfig;
};

type PlayerRef = HTMLDivElement | null;

type PowerUps = Record<PowerUp, number>;

type PlayerState = {
	deathCount: number;
	/** How many power-ups have been collected */
	powerUps: PowerUps;
};

// using object because firebase
type KeyboardConfig = Record<string, PlayerKeyboardConfig> | null; // null for firebase

type PlayerConfig = {
	id: PlayerId;
	coordinates: TopLeftCoordinates;
	state: PlayerState;
	keyboardConfig: KeyboardConfig;
	direction: Direction;
	isWalking: boolean;
	isNPC: boolean;
};

type NonNullablePlayerRef = NonNullable<PlayerRef>;

type NextMoveProps = {
	playerConfig: PlayerConfig;
	direction: Direction;
	is3D: boolean;
	gameMap: GameMap;
};

type KeyMap = {
	[key in KeyboardEventCode]?: boolean;
};

type NPCActionProps = {
	playerId: PlayerId;
	players: Players;
	gameMap: GameMap;
	bombs: Bombs;
	triggerMove: OnTriggerMove;
	dropBomb: OnDropBomb;
	ref: NonNullablePlayerRef;
	powerUpConfig: GameConfig['powerUps'];
	sizes: GameConfig['sizes'];
	bombDuration: GameConfig['duration']['bomb'];
};
type NPCActionFn = (props: NPCActionProps) => void;

type PowerUpOrNull = PowerUp | null;

type FontAwesomeIconProps = Omit<FontAwesomeBaseIconProps, 'icon'>;

type GamePlayers = Partial<Record<PlayerId, PlayerCondition>>;

type GameApi = {
	provider: GameProvider;
	state: GameState;
	type: GameType;
	gamePlayers: GamePlayers;
	// firebase
} & {
	pending?: false | JSX.Element;
	error?: false | JSX.Element;
	// online mode
} & {
	gameId?: OnlineGameId;
	playerId?: PlayerId;
};

type GameApiHookOnline = (gameId?: string) => GameApi;
// it's null if you directly go to /local without /room-creator
type GameApiHookLocal = (gameConfig?: GameConfig) => GameApi | null;

type PickedGameState<K extends keyof GameState> = {
	[P in K]: GameState[P];
};

type OnlineGameId = string;

type OnlineGame = {
	gameId: OnlineGameId;
	gameState: GameState;
	gamePlayers: GamePlayers;
	started: boolean;
};

type GameEnd = Omit<PlayerDisplayProps, 'onStart'> & {
	gameEndCondition: GameEndCondition;
};

export type {
	CollisionCoordinates,
	TileProps,
	TopLeftCoordinates,
	SquareCoordinates,
	Coordinates,
	OnDropBomb,
	Square,
	GameMap,
	KeyboardEventCode,
	PlayerActionKeys,
	KeyboardConfig,
	PlayerId,
	Players,
	PlayerRef,
	PlayerState,
	PlayerConfig,
	PowerUps,
	NonNullablePlayerRef,
	NextMoveProps,
	KeyMap,
	NPCActionProps,
	NPCActionFn,
	Fire,
	PowerUpOrNull,
	FontAwesomeIconProps,
	GameApi,
	GameApiHookOnline,
	GameApiHookLocal,
	PickedGameState,
	OnlineGameId,
	OnlineGame,
	GamePlayers,
	GameEnd,
};
