import { bounceAnimation } from 'animations';
import { Explosive } from 'enums';
import { memo } from 'react';
import styled, { css, keyframes } from 'styled-components';
import theme from 'theme';
import { Fire, TileProps } from '../types';

type WrapperProps = StyledProps<
	TileProps,
	| 'size'
	| 'top'
	| 'left'
	| 'animate'
	| 'color'
	| 'collisionIndex'
	| 'fireSquare'
	| 'firingDuration'
>;

const fireAnimation = (fireSquare: Fire) => {
	let x = 0;
	let y = 0;
	let rotateFrom = '';
	let rotateTo = '';
	let borderRadiusFrom = '';
	let borderRadiusTo = '';

	if (fireSquare === Explosive.FireHorizontal) {
		x = 1;
	} else if (fireSquare === Explosive.FireVertical) {
		y = 1;
	} else {
		x = 0.5;
		y = 0.5;
		rotateFrom = ' rotate(90deg)';
		rotateTo = ' rotate(360deg)';
		borderRadiusFrom = 'border-radius: 50%;';
		borderRadiusTo = 'border-radius: 0%;';
	}

	return keyframes`
		// cool effect
		/* 0% { border: 16px solid ${theme.palette.background.primary}; transform: scale(${x}, ${y})${rotateFrom}; ${borderRadiusFrom} } */
		0% { background-color: ${theme.palette.background.primary}; transform: scale(${x}, ${y})${rotateFrom}; ${borderRadiusFrom} }
		20% { background-color: ${theme.palette.color.error}; }
		40% { background-color: ${theme.palette.color.info}; }
		50% { ${borderRadiusTo} }
		60% { background-color: ${theme.palette.color.error}; }
		80% { background-color: ${theme.palette.color.info}; }
		100% { background-color: ${theme.palette.color.error}; transform: scale(1)${rotateTo};  }
	`;
};

const Wrapper = styled.div.attrs<WrapperProps>(
	({ $size, $top, $left, $color }) => ({
		style: {
			width: $size,
			height: $size,
			top: $top,
			left: $left,
			...($color && { backgroundColor: $color }),
		},
	})
)<WrapperProps>`
	position: absolute;
	/* background-color: ${theme.palette.background.secondary}; */
	border: 1px solid ${theme.palette.background.primary};
	${({ $color, $collisionIndex, $animate, $fireSquare, $firingDuration }) => {
		return (
			($fireSquare &&
				css`
					border: none;
					animation: ${fireAnimation($fireSquare)}
						${($firingDuration || 1) / 2}s var(--ease-in-out-quint)
						forwards;
				`) ||
			($animate &&
				$color &&
				css`
					transform: scale(0, 0);
					z-index: 9999;
					animation: ${bounceAnimation()}
						var(--block-animation-duration) ease
						calc(
							${$collisionIndex as number} *
								var(--incremental-animation-delay)
						)
						forwards;
				`) ||
			''
		);
	}}
`;

const Tile = ({
	size,
	top,
	left,
	color,
	collisionIndex,
	animate = false,
	fireSquare,
	firingDuration,
}: TileProps) => {
	return (
		<Wrapper
			$size={size}
			$top={top}
			$left={left}
			$color={color}
			$collisionIndex={collisionIndex}
			$animate={animate}
			$fireSquare={fireSquare}
			$firingDuration={firingDuration}
		/>
	);
};

export default memo(Tile);
