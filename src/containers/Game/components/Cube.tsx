import './Cube.scss';
import styled from 'styled-components';
import { TileProps } from '../types';

const CuboidSide = styled.div``;

const Cuboid = styled.div<StyledProps<TileProps, 'size'>>`
	${({ $size }) => `
		--tile-size: ${$size};
	`}
	height: calc(var(--tile-size) * 1px);
	width: calc(var(--tile-size) * 1px);
	transform-style: preserve-3d;
	position: absolute;
	transform-origin: center center;
	transition: 300ms;

	transform: scale(1, 1) translateZ(calc(var(--tile-size) / 2 * -1px));

	& > ${CuboidSide} {
		border: 1px solid var(--primary-background);

		height: calc(var(--tile-size) * 1px);
		width: calc(var(--tile-size) * 1px);
		/* transform-origin: 50% 50%; */
		top: 50%;
		left: 50%;
		position: absolute;

		/** @see https://codepen.io/jh3y/pen/BaKqQLJ */
		&:nth-of-type(1) {
			transform: translate(-50%, -50%) rotateX(-90deg)
				translateZ(calc((var(--tile-size) / 2) * 1px));
		}
		&:nth-of-type(2) {
			transform: translate(-50%, -50%) rotateX(-90deg) rotateY(180deg)
				translateZ(calc((var(--tile-size) / 2) * 1px));
		}
		&:nth-of-type(3) {
			transform: translate(-50%, -50%) rotateX(-90deg) rotateY(90deg)
				translateZ(calc((var(--tile-size) / 2) * 1px));
		}
		&:nth-of-type(4) {
			transform: translate(-50%, -50%) rotateX(-90deg) rotateY(-90deg)
				translateZ(calc((var(--tile-size) / 2) * 1px));
		}
		&:nth-of-type(5) {
			background-color: var(--secondary-background);
			transform: translate(-50%, -50%)
				translateZ(calc((var(--tile-size) / 2) * 1px));
		}
		&:nth-of-type(6) {
			transform: translate(-50%, -50%)
				translateZ(calc((var(--tile-size) / 2) * -1px)) rotateX(180deg);
		}
	}

	&.bouncy-block- {
		&no-animation {
			transform: translateZ(calc(var(--tile-size) / 2 * 1px));
			& > ${CuboidSide} {
				background-color: var(--secondary-color);
			}
		}

		&0 {
			transform: translateZ(calc(var(--tile-size) / 2 * 1px))
				rotateX(0deg) rotateY(0deg) rotateZ(0deg);
		}
	}
`;

const Cube = ({
	size,
	top,
	left,
	animate = false,
	variant,
	color: backgroundColor,
	collisionIndex,
	style,
	className,
	...rest
}: TileProps) => {
	const _className = `cuboid bouncy-block-${
		(!animate && 'no-animation') || collisionIndex || 0
	} ${variant}${(className && ` ${className}`) || ''}`;

	return (
		<Cuboid
			className={_className}
			style={{ ...style, top, left, width: size, height: size }}
			$size={size}
			{...rest}
		>
			{Array(6)
				.fill(0)
				.map((_, ind) => (
					<CuboidSide
						key={ind}
						style={{
							...(backgroundColor && { backgroundColor }),
							width: size,
							height: size,
						}}
					/>
				))}
		</Cuboid>
	);
};

export default Cube;
