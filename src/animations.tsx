import { keyframes } from 'styled-components';

/** @see https://codepen.io/nelledejones/pen/gOOPWrK#L68 */
const bounceAnimation = (withOpacity = false) => keyframes`
	0% { transform: scale(0, 0); }
	25% { transform: scale(0.9, 1.1); }
	50% { transform: scale(1.1, 0.9); }
	75% { transform: scale(0.95, 1.05); }
	100% { transform: scale(1, 1); ${(withOpacity && 'opacity: 1;') || ''} }
`;

export { bounceAnimation };
