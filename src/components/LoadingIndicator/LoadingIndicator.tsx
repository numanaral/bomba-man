import styled, { css, keyframes } from 'styled-components';
import { HexColor } from './types';

interface Props {
	color?: HexColor;
	fullSize?: boolean;
	fullWidth?: boolean;
}

const StyledDiv = styled.div<StyledProps<Props, 'fullSize' | 'fullWidth'>>`
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

/** @see https://github.com/gregdev38/explosion-effect/blob/b4fc18db74ad5a1d0543affc2a89035c07c1fe11/style.css#L11-L39 */
const explosionKeyframes = (color: string) => keyframes`
	0%, 100% {
		box-shadow: 0 0 20px ${color}33, 0 0 40px ${color}33,
			0 0 60px ${color}33, 0 0 80px ${color}33,
			0 0 160px ${color}33, 0 0 240px ${color}33,
			0 0 420px ${color}33;
	}
	50% {
		box-shadow: 0 0 0 30px ${color}33,
			0 0 0 60px ${color}33, 0 0 0 120px ${color}33,
			0 0 0 180px ${color}33, 0 0 0 240px ${color}33,
			0 0 0 360px ${color}33, 0 0 0 480px ${color}33,
			0 0 0 720px ${color}33, 0 0 0 980px ${color}33;
	}
`;

const Explosion = styled.div<{ $color: string }>`
	width: 20px;
	height: 20px;
	border-radius: 50%;
	${({ $color }) => css`
		background: ${$color};
		animation: ${explosionKeyframes($color)} 3s var(--ease-in-out-quint)
			infinite;
	`}
`;

const LoadingIndicator = ({
	color = '#f44336',
	fullSize = false,
	fullWidth = false,
	...rest
}: Props) => {
	return (
		<StyledDiv $fullSize={fullSize} $fullWidth={fullWidth} {...rest}>
			<Explosion $color={color} />
		</StyledDiv>
	);
};

export default LoadingIndicator;
