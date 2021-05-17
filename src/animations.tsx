import { keyframes } from 'styled-components';

/** @see https://codepen.io/nelledejones/pen/gOOPWrK#L68 */
const bounceAnimation = (withOpacity = false) => keyframes`
	0% { transform: scale(0, 0); }
	25% { transform: scale(0.9, 1.1); }
	50% { transform: scale(1.1, 0.9); }
	75% { transform: scale(0.95, 1.05); }
	100% { transform: scale(1, 1); ${(withOpacity && 'opacity: 1;') || ''} }
`;

const ghostAnimation = (size: number, color: string) => keyframes`
	0%, 100% { 
		transform: translateY(0px); 
		box-shadow: 0 10px 10px #000000;
	}
	50% {
		transform: translateY(-10px);
		box-shadow: 0 20px ${Math.ceil(size / 6) + 10}px ${color};
	}
`;

export { bounceAnimation, ghostAnimation };
