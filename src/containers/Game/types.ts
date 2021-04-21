import * as KeyCode from 'keycode-js';
import { Direction, Player, Tile, PowerUp, Bomb } from 'enums';
// import { Immutable } from 'immer';

type CollisionCoordinates = {
	[key: number]: number;
};

interface TileProps extends React.HTMLAttributes<HTMLDivElement> {
	size: number;
	top: number;
	left: number;
	animate?: boolean;
	variant: Square;
	color?: string;
	collisionIndex?: number;
}

type BombType = {
	id: string;
	top: number;
	left: number;
};

type TopLeftCoordinates = {
	top: number;
	left: number;
};

type AddBomb = ({ top, left }: Omit<BombType, 'id'>) => void;

type Square = Player | Tile | PowerUp | Bomb;

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
type CharacterKeyboardConfig = MovementActions & CharacterActions;

type PlayerId = `P${RangeOf<4, 1>}`;
// #endregion

type Players = {
	[key in PlayerId]?: PlayerConfig;
};

type PlayerRef = HTMLDivElement | null;

type PlayerConfig = {
	id: PlayerId;
	coordinates: TopLeftCoordinates;
	ref: PlayerRef;
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

export type {
	CollisionCoordinates,
	TileProps,
	BombType,
	TopLeftCoordinates,
	AddBomb,
	Square,
	GameMap,
	KeyboardEventCode,
	CharacterKeyboardConfig,
	PlayerId,
	Players,
	PlayerRef,
	PlayerConfig,
	NonNullablePlayerRef,
	NonNullablePlayer,
	NextMoveProps,
	KeyMap,
};
