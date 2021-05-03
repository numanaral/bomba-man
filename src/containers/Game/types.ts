import { Direction, Player, PowerUp, Tile, Explosive } from 'enums';
import * as KeyCode from 'keycode-js';
import {
	GameConfig,
	GameState,
	OnTriggerMove,
} from 'store/redux/reducers/game/types';
import { FontAwesomeIconProps as FontAwesomeBaseIconProps } from '@fortawesome/react-fontawesome';
import { GameProvider } from 'store/redux/hooks/useGameProvider';

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
type MovementActions = Record<`Move${Direction}`, KeyboardEventCode>;
type CharacterActions = {
	DropBomb: KeyboardEventCode;
	// Jump: KeyboardEventCode;
};
type PlayerKeyboardConfig = MovementActions & CharacterActions;

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

type PlayerConfig = {
	id: PlayerId;
	coordinates: TopLeftCoordinates;
	state: PlayerState;
	keyboardConfig: PlayerKeyboardConfig | undefined;
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

type CharacterProps = {
	id: PlayerId;
	name: string;
	coordinates: TopLeftCoordinates;
	keyboardConfig?: PlayerKeyboardConfig;
	highlight?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

type NPCActionProps = {
	playerId: PlayerId;
	players: Players;
	gameMap: GameMap;
	triggerMove: OnTriggerMove;
	dropBomb: OnDropBomb;
	ref: NonNullablePlayerRef;
	sizes: GameConfig['sizes'];
	bombDuration: GameConfig['duration']['bomb'];
};
type NPCActionFn = (props: NPCActionProps) => void;

type PowerUpOrNull = PowerUp | null;

type FontAwesomeIconProps = Omit<FontAwesomeBaseIconProps, 'icon'>;

type GameApi = {
	provider: GameProvider;
	state: GameState;
} & {
	pending?: false | JSX.Element;
	error?: false | JSX.Element;
};

type GameApiHook = (gameId?: string) => GameApi;

type PickedGameState<K extends keyof GameState> = {
	[P in K]: GameState[P];
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
	PlayerKeyboardConfig,
	PlayerId,
	Players,
	PlayerRef,
	PlayerState,
	PlayerConfig,
	PowerUps,
	NonNullablePlayerRef,
	NextMoveProps,
	KeyMap,
	CharacterProps,
	NPCActionProps,
	NPCActionFn,
	Fire,
	PowerUpOrNull,
	FontAwesomeIconProps,
	GameApi,
	GameApiHook,
	PickedGameState,
};
