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
