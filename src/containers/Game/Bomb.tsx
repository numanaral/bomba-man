import config from 'config';
import { Axis, ExplosionState } from 'enums';
import { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { sleep } from 'utils';
import { getExplosionScaleSize } from 'utils/game';

interface Props {
	// skin: Skin;
	color: string;
	firingDuration: number;
	explodingDuration: number;
	explosionSize: number;
	top: number;
	left: number;
}

const incrementalSpeedRotationKeyframes = keyframes`
	0% { transform:rotate(0deg); }
	/* 40% -> 100% */
	${Array(7)
		.fill(0)
		.map(
			(_, ind) =>
				/* start at 40% */
				`${(ind + 4) * 10}% {transform: rotate(${
					/* gradually increase the rotation degree multiplier */
					(ind + 1) * ((ind < 4 && 90) || (ind < 6 && 270) || 360)
				}deg);}`
		)
		.join('\n')}
`;

const FiringBomb = styled.div`
	animation: ${incrementalSpeedRotationKeyframes} linear forwards;
`;

interface ExplosionProps {
	$explosionAxis: Axis;
	$explosionSize: number;
}

const overflowLimit = 0.5;
const explosionKeyframes = ({
	$explosionAxis,
	$explosionSize,
}: ExplosionProps) => {
	const explosionScaleSize = getExplosionScaleSize($explosionSize);

	let x = 2;
	let y = 2;
	if ($explosionAxis === Axis.X) x = explosionScaleSize;
	else y = explosionScaleSize;

	// prevent overflow
	x -= overflowLimit;
	y -= overflowLimit;

	return keyframes`
	  	0% {
			transform: scale(1);
			opacity: 1;
		}
		65% {
			transform: scale(${x}, ${y});
		}
		100% {
			opacity: 0;
		}
	`;
};

const Explosion = styled.div<ExplosionProps>`
	${({ $explosionAxis, $explosionSize }) => css`
		animation: ${explosionKeyframes({ $explosionAxis, $explosionSize })}
			/** @see https://easings.net/#easeInOutBack */
			cubic-bezier(0.68, -0.6, 0.32, 1.6) forwards;
	`}
`;

const Bomb = ({
	color: backgroundColor,
	firingDuration,
	explodingDuration,
	explosionSize,
	top,
	left,
}: Props) => {
	const [explosionState, setExplosionState] = useState<ExplosionState>(
		ExplosionState.Firing
	);
	useEffect(() => {
		const triggerExplosion = async () => {
			await sleep(firingDuration * 1000);
			setExplosionState(ExplosionState.Exploding);
			await sleep(explodingDuration * 1000);
			setExplosionState(ExplosionState.Exploded);
		};
		triggerExplosion();
	}, [explodingDuration, explosionSize, firingDuration]);

	const bombSize = config.size.bomb;
	const bombSizePadding = bombSize / 2;

	let bombElement = null;
	const bombProps: React.CSSProperties = {
		position: 'absolute',
		backgroundColor,
		width: bombSize,
		height: bombSize,
		top: top + bombSizePadding,
		left: left + bombSizePadding,
		animationDuration: `${explodingDuration}s`,
	};

	if (explosionState === ExplosionState.Exploding) {
		bombElement = (
			<>
				<Explosion
					style={bombProps}
					$explosionAxis={Axis.X}
					$explosionSize={explosionSize}
				/>
				<Explosion
					style={bombProps}
					$explosionAxis={Axis.Y}
					$explosionSize={explosionSize}
				/>
			</>
		);
	}
	if (explosionState === ExplosionState.Firing) {
		bombElement = (
			<FiringBomb
				style={{
					...bombProps,
					animationDuration: `${firingDuration}s`,
				}}
			/>
		);
	}
	return bombElement;
};

export default Bomb;
