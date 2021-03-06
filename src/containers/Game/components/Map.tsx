import usePrevious from 'hooks/usePrevious';
import styled from 'styled-components';
import theme from 'theme';
import { Explosive, Tile as TileEnum } from 'enums';
import { isPowerUp } from 'utils/game';
import { useEffect } from 'react';
import { GameConfig, GameConfigRanges } from 'store/redux/reducers/game/types';
import Cube from './Cube';
import Tile from './Tile';
import { GameMap, Square, TileProps } from '../types';
import PowerUp from './PowerUp';

interface Props {
	sizes: GameConfig['sizes'];
	firingDuration: GameConfigRanges.FiringDuration;
	gameMap: GameMap;
	is3D: boolean;
	isTopView: boolean;
	animationCounter: number;
}

const Wrapper = styled.div<
	StyledProps<Props, 'is3D' | 'isTopView'> & {
		$mapSize: GameConfig['sizes']['map'];
		$tileSize: GameConfig['sizes']['tile'];
	}
>`
	${({ $mapSize, $tileSize }) => `
		width: calc(${$tileSize}px * ${$mapSize});
		height: calc(${$tileSize}px * ${$mapSize});
	`}
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
	sizes: { map: mapSize, tile: tileSize },
	firingDuration,
	gameMap,
	is3D,
	isTopView,
	animationCounter,
	children,
}) => {
	// we only need to animate when new collision is set using the button
	// need to prevent explosion diff from re-animating tiles
	const previousAnimationCounter = usePrevious(animationCounter);
	let shouldAnimate = animationCounter !== previousAnimationCounter;

	useEffect(() => {
		// eslint-disable-next-line react-hooks/exhaustive-deps
		shouldAnimate = true;
	}, []);

	let collisionIndex = 1;
	return (
		<Wrapper
			$mapSize={mapSize}
			$tileSize={tileSize}
			$is3D={is3D}
			$isTopView={isTopView}
		>
			{Object.keys(gameMap).map((outer, outerInd) => {
				return Object.values(gameMap[outer]).map(
					(square: Square, innerInd) => {
						const hasCollision =
							square === TileEnum.NonBreaking ||
							square === TileEnum.Breaking;

						const key = `${outerInd}_${innerInd}`;
						const squareSize = tileSize;
						const top = outerInd * tileSize;
						const left = innerInd * tileSize;

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
							firingDuration,
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
					}
				);
			})}
			{children}
		</Wrapper>
	);
};

export default Map;
