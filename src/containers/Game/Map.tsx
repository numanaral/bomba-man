import usePrevious from 'hooks/usePrevious';
import config from 'config';
import styled from 'styled-components';
import theme from 'theme';
import { Tile as TileEnum } from 'enums';
import Cube from './Cube';
import Tile from './Tile';
import { GameMap, Square } from './types';

interface Props {
	size: RangeOf<15>;
	gameMap: GameMap;
	is3D: boolean;
	isTopView: boolean;
	animationCounter: number;
	children: React.ReactNode;
}

const Wrapper = styled.div<StyledProps<Props, 'size' | 'is3D' | 'isTopView'>>`
	width: ${({ $size }) => `calc(${theme.game.character.size} * ${$size})`};
	height: ${({ $size }) => `calc(${theme.game.character.size} * ${$size})`};
	border-radius: ${theme.shape.borderRadius};
	background-color: ${theme.palette.background.secondary};
	position: relative;
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5), 0 6px 6px rgba(0, 0, 0, 0.6);
	transition: transform var(--block-animation-duration);

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
	gameMap,
	is3D,
	isTopView,
	animationCounter,
	children,
}: Props) => {
	// we only need to animate when new collision is set using the button
	// need to prevent explosion diff from re-animating tiles
	const previousAnimationCounter = usePrevious(animationCounter);
	const shouldAnimate = animationCounter !== previousAnimationCounter;

	let collisionIndex = 1;
	return (
		<Wrapper $size={size} $is3D={is3D} $isTopView={isTopView}>
			{gameMap.map((outer, outerInd) => {
				return outer.map((square: Square, innerInd) => {
					const hasCollision =
						square === TileEnum.NonBreaking ||
						square === TileEnum.Breaking;

					const props: React.ComponentPropsWithRef<typeof Cube> = {
						key: `${outerInd}_${innerInd}`,
						size: config.size.tile,
						top: outerInd * config.size.tile,
						left: innerInd * config.size.tile,
						animate: shouldAnimate,
						variant: square,
						...(hasCollision && {
							color:
								theme.palette.color[
									square === TileEnum.NonBreaking
										? 'secondary'
										: 'primary'
								],
							collisionIndex: collisionIndex++,
						}),
					};

					return (
						(is3D &&
							((hasCollision && <Cube {...props} />) || (
								<Tile {...props} />
							))) || <Tile {...props} />
					);
				});
			})}
			{children}
		</Wrapper>
	);
};

export default Map;
