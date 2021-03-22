import styled from 'styled-components';
import theme from 'theme';
import Tile from './Tile';

const TILE_SIZE = 32;

interface Props {
	size: RangeOf<15>;
	collisionCoordinates?: CollisionCoordinates;
	children: React.ReactNode;
}

const Wrapper = styled.div<StyledProps<Props, 'size'>>`
	width: ${({ $size }) => `calc(${theme.game.character.size} * ${$size})`};
	height: ${({ $size }) => `calc(${theme.game.character.size} * ${$size})`};
	border-radius: ${theme.shape.borderRadius};
	background-color: ${theme.palette.background.secondary};
	position: relative;
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5), 0 6px 6px rgba(0, 0, 0, 0.6);
`;

const Map = ({ size, collisionCoordinates = {}, children }: Props) => {
	const map = Array(size).fill(Array(size).fill(0));

	let collisionIndex = 1;
	return (
		<Wrapper $size={size}>
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
