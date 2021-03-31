import styled from 'styled-components';
import theme from 'theme';
import Tile from './Tile';

const TILE_SIZE = 32;

interface Props {
	size: RangeOf<15>;
	collisionCoordinates?: CollisionCoordinates;
	is3D: boolean;
	isTopView: boolean;
	children: React.ReactNode;
}

const Wrapper = styled.div<StyledProps<Props, 'size' | 'is3D' | 'isTopView'>>`
	width: ${({ $size }) => `calc(${theme.game.character.size} * ${$size})`};
	height: ${({ $size }) => `calc(${theme.game.character.size} * ${$size})`};
	border-radius: ${theme.shape.borderRadius};
	background-color: ${theme.palette.background.secondary};
	position: relative;
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5), 0 6px 6px rgba(0, 0, 0, 0.6);
	transition: transform 0.5s;

	${({ $is3D, $isTopView }) => {
		let style = '';
		if ($is3D) {
			style += 'transform-style: preserve-3d;';
			if (!$isTopView) {
				style += `\ntransform: rotateX(-24deg) rotateY(-24deg) rotateX(90deg);`;
			}
		}
		return style;
	}}
`;

const Map = ({
	size,
	collisionCoordinates = {},
	is3D,
	isTopView,
	children,
}: Props) => {
	const map = Array(size).fill(Array(size).fill(0));

	const previousCoordinates = usePrevious(
		JSON.stringify(collisionCoordinates)
	);

	// we only need to animate when new collision is set
	// not when the view changes
	const shouldAnimate =
		JSON.stringify(collisionCoordinates) !== previousCoordinates;

	let collisionIndex = 1;
	return (
		<Wrapper $size={size} $is3D={is3D} $isTopView={isTopView}>
			{map.map((outer: Array<number>, outerInd) => {
				return outer.map((_, innerInd) => {
					const hasCollision =
						collisionCoordinates[innerInd] === outerInd;
					return (
						<Tile
							key={`${outerInd}_${innerInd}`}
							size={TILE_SIZE}
							top={outerInd * TILE_SIZE}
							left={innerInd * TILE_SIZE}
							{...(hasCollision && {
								color: theme.palette.color.secondary,
								collisionIndex: collisionIndex++,
							})}
						/>
					);
				});
			})}
			{children}
		</Wrapper>
	);
};

export default Map;
