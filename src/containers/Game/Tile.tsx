import { memo } from 'react';
import styled, { css, keyframes } from 'styled-components';
import theme from 'theme';
import { TileProps } from './types';

type WrapperProps = StyledProps<
	TileProps,
	'size' | 'top' | 'left' | 'animate' | 'color' | 'collisionIndex'
>;

/** @see https://codepen.io/nelledejones/pen/gOOPWrK#L68 */
const bounceAnimation = keyframes`
	0% { transform: scale(0, 0); }
	25% { transform: scale(0.9, 1.1); }
	50% { transform: scale(1.1, 0.9); }
	75% { transform: scale(0.95, 1.05); }
	100% { transform: scale(1, 1); }
`;

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
	${({ $color, $collisionIndex, $animate }) => {
		return (
			($animate &&
				$color &&
				css`
					transform: scale(0, 0);
					z-index: 9999;
					animation: ${bounceAnimation}
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
	animate,
	color,
	collisionIndex,
}: TileProps) => {
	return (
		<Wrapper
			$size={size}
			$top={top}
			$left={left}
			$animate={animate}
			$color={color}
			$collisionIndex={collisionIndex}
		/>
	);
};

export default memo(Tile);
