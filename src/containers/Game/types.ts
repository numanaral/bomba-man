import { Player, Tile, PowerUp } from 'enums';

type CollisionCoordinates = {
	[key: number]: number;
};

interface TileProps extends React.HTMLAttributes<HTMLDivElement> {
	size: number;
	top: number;
	left: number;
	animate: boolean;
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

export type {
	CollisionCoordinates,
	TileProps,
	BombType,
	TopLeftCoordinates,
	AddBomb,
	Square,
	GameMap,
};
