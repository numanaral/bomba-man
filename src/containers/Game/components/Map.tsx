import usePrevious from 'hooks/usePrevious';
import config from 'config';
import styled from 'styled-components';
import theme from 'theme';
import { Explosive, Tile as TileEnum } from 'enums';
import { isPowerUp } from 'utils/game';
import Cube from './Cube';
import Tile from './Tile';
import { GameMap, Square, TileProps } from '../types';
import PowerUp from './PowerUp';

interface Props {
	size: RangeOf<15>;
	gameMap: GameMap;
	is3D: boolean;
	isTopView: boolean;
	animationCounter: number;
}

const Wrapper = styled.div<StyledProps<Props, 'size' | 'is3D' | 'isTopView'>>`
	width: ${({ $size }) => `calc(${theme.game.tile.size} * ${$size})`};
	height: ${({ $size }) => `calc(${theme.game.tile.size} * ${$size})`};
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

const Map: React.FC<Props> = ({
	size,
	gameMap,
	is3D,
	isTopView,
	animationCounter,
	children,
}) => {
	// we only need to animate when new collision is set using the button
	// need to prevent explosion diff from re-animating tiles
	const previousAnimationCounter = usePrevious(animationCounter);
	const shouldAnimate =
		animationCounter !== previousAnimationCounter || animationCounter === 0;

	let collisionIndex = 1;
	return (
		<Wrapper $size={size} $is3D={is3D} $isTopView={isTopView}>
			{gameMap.map((outer, outerInd) => {
				return outer.map((square: Square, innerInd) => {
					const hasCollision =
						square === TileEnum.NonBreaking ||
						square === TileEnum.Breaking;

					const key = `${outerInd}_${innerInd}`;
					const squareSize = config.size.tile;
					const top = outerInd * config.size.tile;
					const left = innerInd * config.size.tile;

					// if it's a PowerUp
					if (isPowerUp(square)) {
						return (
							<PowerUp
								key={key}
								size={squareSize}
								variant={square as ValuesOf<typeof PowerUp>}
								top={top}
								left={left}
							/>
						);
					}

					let fireSquare;
					if (
						square === Explosive.FireCore ||
						square === Explosive.FireHorizontal ||
						square === Explosive.FireVertical
					) {
						fireSquare = square;
					}

					// TODO: Get this key properly
					const props: TileProps & { key: string } = {
						key,
						size: squareSize,
						top,
						left,
						animate: shouldAnimate,
						variant: square,
						fireSquare,
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
