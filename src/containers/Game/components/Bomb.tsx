import { ExplosionState, Explosive } from 'enums';
import useIsUnmounted from 'hooks/useIsUnmounted';
import { useEffect, useState } from 'react';
import {
	Bomb as BombType,
	BombFn,
	BombId,
	GameConfigRanges,
} from 'store/redux/reducers/game/types';
import styled, { keyframes } from 'styled-components';
import theme from 'theme';
import { sleep } from 'utils';
import Cube from './Cube';

const getTransform = (deg: number, is3D: boolean) => {
	return `${
		is3D
			? `transform: translateZ(calc(var(--tile-size) / 2 * 2px)) rotateX(${deg}deg) rotateY(${deg}deg)`
			: `transform: rotate(${deg}deg)`
	};`;
};

const incrementalSpeedRotationKeyframes = (is3D = false) => keyframes`
	0% { ${getTransform(0, is3D)} }
	
	/* 40% -> 100% */
	${Array(7)
		.fill(0)
		.map(
			(_, ind) =>
				/* start at 40% */
				`${(ind + 4) * 10}% { ${getTransform(
					/* gradually increase the rotation degree multiplier */
					(ind + 1) *
						((is3D && ((ind < 6 && 90) || 100)) ||
							(ind < 4 && 90) ||
							(ind < 6 && 270) ||
							360),
					is3D
				)} }`
		)
		.join('\n')}
`;

const FiringBomb = styled.div`
	animation: ${incrementalSpeedRotationKeyframes()} linear forwards;
`;

const FiringCubeBomb = styled(Cube)`
	/* ${({ size }) => `
		--tile-size: ${size};
	`} */
	animation: ${incrementalSpeedRotationKeyframes(true)} linear forwards;
`;
interface Props extends BombType {
	// skin: Skin;
	color: string;
	tileSize: GameConfigRanges.SquareSize;
	firingDuration: number;
	explodingDuration: number;
	triggerExplosion: BombFn;
	onExplosionComplete: BombFn;
	is3D: boolean;
}

const Bomb = ({
	color: backgroundColor,
	firingDuration,
	explodingDuration,
	// explosionSize,
	tileSize,
	id,
	top,
	left,
	triggerExplosion,
	onExplosionComplete,
	is3D,
}: Props) => {
	const [explosionState, setExplosionState] = useState<ExplosionState>(
		ExplosionState.Firing
	);

	const isMounted = useIsUnmounted();

	useEffect(() => {
		const kaboom = async () => {
			await sleep(firingDuration * 1000);
			if (!isMounted.current) return;
			triggerExplosion(id, async (bombIds: Set<BombId>) => {
				if (!isMounted.current) return;
				// update animation
				setExplosionState(ExplosionState.Exploding);
				await sleep(explodingDuration * 1000);

				if (!isMounted.current) return;
				// complete explosion for this bomb
				onExplosionComplete(id);
				// then complete the explosion for all the other bombs
				// that got caught in the fire complete their explosion
				// as the trigger was already handled in the reducer
				bombIds.forEach(bId => {
					onExplosionComplete(bId);
				});
			});
		};
		kaboom();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const bombSize = tileSize / 2;
	const bombPadding = bombSize / 2;

	const bombStyleProps: React.CSSProperties = {
		position: 'absolute',
		backgroundColor,
		width: bombSize,
		height: bombSize,
		top: top + bombPadding,
		left: left + bombPadding,
		animationDuration: `${firingDuration}s`,
	};

	return (
		(explosionState === ExplosionState.Firing &&
			((!is3D && <FiringBomb style={bombStyleProps} />) || (
				<FiringCubeBomb
					size={bombSize}
					top={Number(bombStyleProps.top)}
					left={Number(bombStyleProps.left)}
					animate={false}
					variant={Explosive.Bomb}
					color={theme.palette.color.error}
					collisionIndex={1}
					style={bombStyleProps}
				/>
			))) ||
		null
	);
};

export default Bomb;
