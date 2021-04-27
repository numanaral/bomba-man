import styled, { css, keyframes } from 'styled-components';
import { HexColor } from './types';

interface Props {
	color?: HexColor;
	fullSize?: boolean;
	fullWidth?: boolean;
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
const rippleKeyframes = () => keyframes`
	0% {
		top: 144px;
		left: 144px;
		width: 0;
		height: 0;
		opacity: 1;
	}
	100% {
		top: 0px;
		left: 0px;
		width: 288px;
		height: 288px;
		opacity: 0;
	}
`;

const Explosion = styled.div<{ $color: string }>`
	display: inline-block;
	position: relative;
	width: 200px;
	height: 200px;

	div {
		position: absolute;
		opacity: 1;
		border-radius: 50%;
		${({ $color }) => css`
			border: 4px solid ${$color};
			animation: ${rippleKeyframes()} 1s cubic-bezier(0, 0.2, 0.8, 1)
				infinite;
		`}
	}

	div:nth-child(2) {
		animation-delay: -0.5s;
	}

	div:nth-child(3) {
		animation-delay: -1s;
	}
`;

const LoadingIndicator = ({
	color = '#f44336',
	fullSize = false,
	fullWidth = false,
	...rest
}: Props) => {
	return (
		<Wrapper $fullSize={fullSize} $fullWidth={fullWidth} {...rest}>
			<Explosion $color={color}>
				<div />
				<div />
				<div />
				<div />
				<div />
			</Explosion>
		</Wrapper>
	);
};

export default LoadingIndicator;
