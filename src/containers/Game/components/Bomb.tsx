import config from 'config';
import { Axis, ExplosionState, Explosive } from 'enums';
import { useEffect, useState } from 'react';
import { OnExplosion } from 'store/redux/reducers/game/types';
import styled, { css, keyframes } from 'styled-components';
import theme from 'theme';
import { sleep } from 'utils';
import { getExplosionCoordinates } from 'utils/game';
import Cube from './Cube';

interface Props {
	// skin: Skin;
	color: string;
	firingDuration: number;
	explodingDuration: number;
	explosionSize: number;
	id: string;
	top: number;
	left: number;
	onExplosion: OnExplosion;
	is3D: boolean;
}

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

interface ExplosionProps {
	explosionAxis: Axis;
	explosionSize: number;
}

const explosionKeyframes = (explosionProps: ExplosionProps, is3D = false) => {
	const { x, y } = getExplosionCoordinates(explosionProps, is3D);

	const transformation3D =
		(is3D && `translateZ(calc((var(--tile-size) / 2) * 1px)) `) || '';

	return keyframes`
	  	0% {
			transform: ${transformation3D}scale(1, 1);
			/* transform:${transformation3D} scale(${x}, ${y}); */
			${(!is3D && 'opacity: 1;') || ''}
		}
		65% {
			transform: ${transformation3D}scale(${x}, ${y});
		}
		100% {
			${(!is3D && 'opacity: 0;') || ``}
		}
	`;
};

const borderKeyframes = () => keyframes`
	25% {
		border-width: ${config.size.tile * 0.5}px
	}
	70% {
		background-color: black;
	}
`;

const Explosion = styled.div<
	StyledProps<ExplosionProps, 'explosionAxis' | 'explosionSize'>
>`
	${({ $explosionAxis, $explosionSize }) => css`
		animation: ${explosionKeyframes({
				explosionAxis: $explosionAxis,
				explosionSize: $explosionSize,
			})}
			var(--ease-in-out-back) forwards;
	`}
`;

const ExplosionCube = styled(Cube)<
	StyledProps<
		ExplosionProps & { firingDuration: number },
		'explosionAxis' | 'explosionSize' | 'firingDuration'
	>
>`
	${({ $explosionAxis, $explosionSize, $firingDuration }) => css`
		animation: ${explosionKeyframes(
				{
					explosionAxis: $explosionAxis,
					explosionSize: $explosionSize,
				},
				true
			)}
			${$firingDuration}s var(--ease-in-out-back) forwards;
		& {
			border: none;
		}
		& * {
			animation: ${borderKeyframes()} ${$firingDuration * 0.75}s ease-out
				forwards;
		}
	`}
`;

const Bomb = ({
	color: backgroundColor,
	firingDuration,
	explodingDuration,
	explosionSize,
	id,
	top,
	left,
	onExplosion,
	is3D,
}: Props) => {
	const [explosionState, setExplosionState] = useState<ExplosionState>(
		ExplosionState.Firing
	);
	useEffect(() => {
		const triggerExplosion = async () => {
			await sleep(firingDuration * 1000);
			setExplosionState(ExplosionState.Exploding);
			await sleep((explodingDuration / 2) * 1000);
			onExplosion({ bombId: id, bombCoordinates: { top, left } });
			// await sleep((300 / 2) * 1000);
			// setExplosionState(ExplosionState.Exploded);
		};
		triggerExplosion();
	}, [
		explodingDuration,
		explosionSize,
		firingDuration,
		onExplosion,
		top,
		left,
		id,
	]);

	const bombSize = config.size.bomb;
	const bombSizePadding = bombSize / 2;

	let bombElement = null;
	const bombStyleProps: React.CSSProperties = {
		position: 'absolute',
		backgroundColor,
		width: bombSize,
		height: bombSize,
		top: top + bombSizePadding,
		left: left + bombSizePadding,
		animationDuration: `${explodingDuration}s`,
	};

	if (explosionState === ExplosionState.Exploding) {
		const props = {
			$explosionSize: explosionSize,
			$firingDuration: firingDuration,
		};
		bombElement = (!is3D && (
			<>
				<Explosion
					style={bombStyleProps}
					$explosionAxis={Axis.X}
					{...props}
				/>
				<Explosion
					style={bombStyleProps}
					$explosionAxis={Axis.Y}
					{...props}
				/>
			</>
		)) || (
			<>
				<ExplosionCube
					size={config.size.tile}
					top={top}
					left={left}
					// animate
					variant={Explosive.Bomb}
					color={theme.palette.color.error}
					collisionIndex={1}
					style={bombStyleProps}
					$explosionAxis={Axis.X}
					{...props}
				/>
				<ExplosionCube
					size={config.size.tile}
					top={top}
					left={left}
					// animate
					variant={Explosive.Bomb}
					color={theme.palette.color.error}
					collisionIndex={1}
					style={bombStyleProps}
					$explosionAxis={Axis.Y}
					{...props}
				/>
			</>
		);
	}
	if (explosionState === ExplosionState.Firing) {
		const style = {
			...bombStyleProps,
			animationDuration: `${firingDuration}s`,
		};
		bombElement = (!is3D && <FiringBomb style={style} />) || (
			<FiringCubeBomb
				size={bombSize}
				top={Number(bombStyleProps.top)}
				left={Number(bombStyleProps.left)}
				animate={false}
				variant={Explosive.Bomb}
				color={theme.palette.color.error}
				collisionIndex={1}
				style={style}
			/>
		);
	}
	return bombElement;
};

export type { ExplosionProps };
export default Bomb;
