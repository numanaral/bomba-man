import { lighten } from 'polished';
import { GameConfig } from 'store/redux/reducers/game/types';
import { createGlobalStyle } from 'styled-components';

const theme = {
	palette: {
		background: {
			primary: 'var(--primary-background)',
			secondary: 'var(--secondary-background)',
		},
		color: {
			primary: 'var(--primary-color)',
			'primary-lighter': 'var(--primary-color-lighter)',
			secondary: 'var(--secondary-color)',
			'secondary-lighter': 'var(--secondary-color-lighter)',
			error: 'var(--error-color)',
			'error-lighter': 'var(--error-color-lighter)',
			warning: 'var(--warning-color)',
			'warning-lighter': 'var(--warning-color-lighter)',
			success: 'var(--success-color)',
			'success-lighter': 'var(--success-color-lighter)',
			info: 'var(--info-color)',
			'info-lighter': 'var(--info-color-lighter)',
			default: 'var(--default-color)',
			'default-lighter': 'var(--default-color-lighter)',
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
	transition: {
		hover: 'var(--hover-animation-duration)',
	},
	spacing: (s: number) => {
		return s * 8;
	},
};

const COLORS = {
	'--primary-background': '#13141b',
	'--secondary-background': '#1a1d28',
	'--primary-color': '#ec7ebd',
	'--secondary-color': '#763ee6',
	'--error-color': '#f44336',
	'--warning-color': '#ff9800',
	'--success-color': '#4caf50',
	'--info-color': '#2196f3',
	'--default-color': '#E4E6EB',
};

const GlobalStyles = createGlobalStyle<{ $gameConfig: GameConfig }>`
	:root {
		/* #region COLORS */
		${Object.entries(COLORS).reduce((acc, [colorKey, colorValue]) => {
			return `${acc}${colorKey}: ${colorValue};${colorKey}-lighter: ${lighten(
				0.1,
				colorValue
			)};`;
		}, '')}
		/* #endregion */

		/* #region UTILITIES */
		--border-radius: 4px;
		--padding: 10px;
		/* #endregion */

		/* #region GAME */
		${({ $gameConfig }) => `
			--character-size: ${$gameConfig.sizes.character}px;
			--tile-size: ${$gameConfig.sizes.tile}px;
			--game-size: ${$gameConfig.sizes.map}px;
			--exploding-duration: ${$gameConfig.duration.bomb.exploding}s;
			--firing-duration: ${$gameConfig.duration.bomb.firing}s;
		`}
		/* #endregion */
		
		/* #region ANIMATIONS */
		/* @see https://easings.net/#easeInOutBack */
		--ease-in-out-back: cubic-bezier(0.68, -0.6, 0.32, 1.6);
		--ease-in-out-quint: cubic-bezier(0.83, 0, 0.17, 1);
		--incremental-animation-delay: 0.03s;
		--block-animation-duration: 0.5s;
		--hover-animation-duration: 0.3s;
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

		a {
			text-decoration: none;
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
