declare type CollisionCoordinates = {
	[key: number]: number;
};

declare interface TileProps extends React.HTMLAttributes<HTMLDivElement> {
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

type AddBomb = ({ top, left }: Omit<BombType, 'id'>) => void;
