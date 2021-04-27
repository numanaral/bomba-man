import { Direction, Player, PowerUp, Tile, Explosive } from 'enums';
import * as KeyCode from 'keycode-js';
import { GameState, OnTriggerMove } from 'store/redux/reducers/game/types';
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
type GameMap = Array<Array<Square>>;

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
	[PowerUp.Life]: number;
	[PowerUp.BombCount]: number;
	[PowerUp.BombSize]: number;
	[PowerUp.MovementSpeed]: number;
	/** How many power-ups have been collected */
	powerUps: PowerUps;
};

type PlayerConfig = {
	id: PlayerId;
	coordinates: TopLeftCoordinates;
	ref: PlayerRef;
	state: PlayerState;
};

type NonNullablePlayerRef = NonNullable<PlayerRef>;

type NonNullablePlayer = NonNullable<PlayerConfig> & {
	ref: NonNullablePlayerRef;
};

type NextMoveProps = {
	playerConfig: NonNullablePlayer;
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
	keyboardConfig: PlayerKeyboardConfig;
	highlight?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

type NPCActionProps = {
	players: Players;
	gameMap: GameMap;
	triggerMove: OnTriggerMove;
	dropBomb: OnDropBomb;
};

type PowerUpOrNull = PowerUp | null;

type FontAwesomeIconProps = Omit<FontAwesomeBaseIconProps, 'icon'>;

type GameApi = {
	provider: GameProvider;
	state: GameState;
};

type GameApiHook = () => GameApi;

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
	NonNullablePlayer,
	NextMoveProps,
	KeyMap,
	CharacterProps,
	NPCActionProps,
	Fire,
	PowerUpOrNull,
	FontAwesomeIconProps,
	GameApi,
	GameApiHook,
	PickedGameState,
};
