import * as KeyCode from 'keycode-js';
import { Player, Tile, PowerUp } from 'enums';

type CollisionCoordinates = {
	[key: number]: number;
};

interface TileProps extends React.HTMLAttributes<HTMLDivElement> {
	size: number;
	top: number;
	left: number;
	animate: boolean;
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

type Square = Player | Tile | PowerUp;

type GameMap = Array<Array<Square>>;

type KeyboardEventCode = ValuesOf<typeof KeyCode>;

type Direction = 'Up' | 'Right' | 'Down' | 'Left';

// TODO: group types into separate folders/files

// #region Character Config Types
type MovementActions = Record<`Move${Direction}`, KeyboardEventCode>;
type CharacterActions = {
	DropBomb: KeyboardEventCode;
	// Jump: KeyboardEventCode;
};
type CharacterKeyboardConfig = MovementActions & CharacterActions;

type PlayerId = `P${RangeOf<2, 1>}`;
// #endregion

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
};
