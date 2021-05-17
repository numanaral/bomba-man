import styled, { css, keyframes } from 'styled-components';
import { HexColor } from './types';

interface Props {
	color?: HexColor;
	fullSize?: boolean;
	fullWidth?: boolean;
	size?: number;
	rippleCount?: number;
}

const Wrapper = styled.div<StyledProps<Props, 'fullSize' | 'fullWidth'>>`
	justify-content: center;
	align-items: center;
	display: flex;
	vertical-align: middle;
	${({ $fullSize, $fullWidth }) => `
		${
			($fullSize &&
				`
					width: 100%;
					height: 100%;
					position: fixed;
					left: 0;
					top: 0;
					background: #000 !important;
					opacity: 0.8;
					z-index: 99999;
		`) ||
			($fullWidth &&
				`
					width: 100%;
		`) ||
			''
		}
	`}
`;

/** @see https://loading.io/css/ */
const rippleKeyframes = (size: number) => {
	const sizing = Math.round(0.5 * size);
	return keyframes`
	0% {
		top: ${sizing}px;
		left: ${sizing}px;
		width: 0;
		height: 0;
		opacity: 1;
	}
	100% {
		top: 0px;
		left: 0px;
		width: ${sizing * 2}px;
		height: ${sizing * 2}px;
		opacity: 0;
	}
`;
};

const Ripples = styled.div<
	Required<StyledProps<Props, 'size' | 'rippleCount' | 'color'>>
>`
	display: inline-block;
	position: relative;
	${({ $size }) => {
		return `
			width: ${$size}px;
			height: ${$size}px;
		`;
	}}

	div {
		position: absolute;
		opacity: 1;
		border-radius: 50%;
		${({ $color, $size }) => {
			return css`
				border: 4px solid ${$color};
				animation: ${rippleKeyframes($size)} 2s
					cubic-bezier(0, 0.2, 0.8, 1) infinite;
			`;
		}}
	}

	${({ $rippleCount }) => {
		const delays = Array($rippleCount)
			.fill(0)
			.reduce((acc, _, ind) => {
				return `${acc}
				div:nth-child(${ind + 2}) {
					animation-delay: -${(ind + 1) * 0.5 + ind}s;
				}
			`;
			}, '');

		return delays;
	}}
`;

const LoadingIndicator = ({
	color = '#f44336',
	fullSize = false,
	fullWidth = false,
	size = 400,
	rippleCount = 5,
	...rest
}: Props) => {
	return (
		<Wrapper $fullSize={fullSize} $fullWidth={fullWidth} {...rest}>
			<Ripples $color={color} $size={size} $rippleCount={rippleCount}>
				{Array.from({ length: rippleCount }).map((_, ind) => {
					return <div key={ind} />;
				})}
			</Ripples>
		</Wrapper>
	);
};

export default LoadingIndicator;
