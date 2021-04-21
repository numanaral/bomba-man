import config from 'config';
import { createGlobalStyle } from 'styled-components';

const theme = {
	palette: {
		background: {
			primary: 'var(--primary-background)',
			secondary: 'var(--secondary-background)',
		},
		color: {
			primary: 'var(--primary-color)',
			secondary: 'var(--secondary-color)',
			error: 'var(--error-color)',
			warning: 'var(--warning-color)',
			success: 'var(--success-color)',
			info: 'var(--info-color)',
			default: 'var(--default-color)',
		},
	},
	shape: {
		borderRadius: 'var(--border-radius)',
		padding: 'var(--padding)',
	},
	game: {
		character: {
			size: 'var(--character-size)',
		},
		tile: {
			size: 'var(--tile-size)',
		},
	},
};

const GlobalStyles = createGlobalStyle`
	:root {
		/* #region COLORS */
		--primary-background: #13141b;
		--secondary-background: #1a1d28;

		--primary-color: #ec7ebd;
		--secondary-color: #763ee6;

		/* --error-color: rgb(255, 122, 105);
		--warning-color: rgb(241, 168, 23);
		--success-color: rgb(49, 162, 76);
		--info-color: rgb(134, 218, 255);
		--default-color: rgb(228, 230, 235); */
		--error-color: #f44336;
		--warning-color: #ff9800;
		--success-color: #2196f3;
		--info-color: #4caf50;
		--default-color: #E4E6EB;
		/* #endregion */

		/* #region UTILITIES */
		--border-radius: 4px;
		--padding: 10px;
		/* #endregion */

		/* #region GAME */
		--character-size: ${config.size.character}px;
		--tile-size: ${config.size.tile}px;
		--game-size: ${config.size.game}px;
		/* #endregion */
		
		/* #region ANIMATIONS */
		/* @see https://easings.net/#easeInOutBack */
		--ease-in-out-back: cubic-bezier(0.68, -0.6, 0.32, 1.6);
		--incremental-animation-delay: 0.03s;
		--block-animation-duration: 0.5s;
		/* #endregion */

		/* #region GENERICS */
		*, ::before, ::after {
			box-sizing: border-box;
		}

		html,
		body,
		#root {
			width: 100%;
			height: 100%;
			margin: 0;
			padding: 0;
		}

		html {
			background-color: ${theme.palette.background.primary};
			/* color: #fff; */
		}

		#root {
			position: relative;
		}

		pre {
			white-space: pre-wrap;
			word-wrap: break-word;
		}
		/* #endregion */

		/* #region SCROLLBARS */
		*, ::before, ::after {
			scroll-behavior: smooth;
			scrollbar-color: black transparent;
			scrollbar-width: thin;
		}

		/* width */
		::-webkit-scrollbar {
			width: 5px;
			height: 6px;
		}

		/* Track */
		::-webkit-scrollbar-track {
			background: #bfbfbf;
		}

		/* Handle */
		::-webkit-scrollbar-thumb {
			background: black;
			border-radius: 10px;
		}

		/* Handle on hover */
		::-webkit-scrollbar-thumb:hover {
			background: rgba(0, 0, 0, 0.7);
		}
		/* #endregion */
	}
`;

export { GlobalStyles };
export default theme;
