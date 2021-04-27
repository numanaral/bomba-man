import { bounceAnimation } from 'animations';
import styled, { css } from 'styled-components';

const TileIcon = styled.div<{
	$size: number;
	$top: number;
	$left: number;
	$animationDelay?: string;
}>`
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	opacity: 0;
	svg {
		height: 100% !important;
		width: 100% !important;
		max-width: 70%;
		max-height: 80%;
	}
	${({ $size, $animationDelay, $top, $left }) => css`
		top: ${$top}px;
		left: ${$left}px;
		width: ${$size}px;
		height: ${$size}px;
		animation: ${bounceAnimation(true)} var(--block-animation-duration)
			${$animationDelay || ''} ease-out forwards;
	`}
`;

export default TileIcon;
