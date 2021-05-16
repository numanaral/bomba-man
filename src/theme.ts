// TODO: replace polished with material ui's colorManipulator?
// but lighten of mui is not pleasant, darken of polished is the same..
import { lighten } from 'polished';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { GameConfig } from 'store/redux/reducers/game/types';
import { createGlobalStyle } from 'styled-components';
import {
	responsiveFontSizes,
	createMuiTheme,
	// eslint-disable-next-line camelcase
	unstable_createMuiStrictModeTheme,
	ThemeOptions,
} from '@material-ui/core/styles';
import { __IS_DEV__ } from 'app'; // eslint-disable-next-line import/no-unresolved
import { Overrides as CoreOverrides } from '@material-ui/core/styles/overrides';
import { RatingClassKey } from '@material-ui/lab';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CSSProperties } from '@material-ui/styles';

/** @see https://github.com/mui-org/material-ui/issues/12164#issuecomment-564041219 */
interface Overrides extends CoreOverrides {
	// Define additional lab components here as needed....
	MuiRating?:
		| Partial<Record<RatingClassKey, CSSProperties | (() => CSSProperties)>>
		| undefined;
}

interface OverriddenThemeOptions extends ThemeOptions {
	overrides: Overrides;
}

const theme = {
	palette: {
		background: {
			primary: 'var(--primary-background)',
			'primary-lighter': 'var(--primary-background-lighter)',
			'primary-darker': 'var(--primary-background-darker)',
			secondary: 'var(--secondary-background)',
			'secondary-lighter': 'var(--secondary-background-lighter)',
			'secondary-darker': 'var(--secondary-background-darker)',
		},
		color: {
			primary: 'var(--primary-color)',
			'primary-lighter': 'var(--primary-color-lighter)',
			'primary-darker': 'var(--primary-color-darker)',
			secondary: 'var(--secondary-color)',
			'secondary-lighter': 'var(--secondary-color-lighter)',
			'secondary-darker': 'var(--secondary-color-darker)',
			error: 'var(--error-color)',
			'error-lighter': 'var(--error-color-lighter)',
			'error-darker': 'var(--error-color-darker)',
			warning: 'var(--warning-color)',
			'warning-lighter': 'var(--warning-color-lighter)',
			'warning-darker': 'var(--warning-color-darker)',
			success: 'var(--success-color)',
			'success-lighter': 'var(--success-color-lighter)',
			'success-darker': 'var(--success-color-darker)',
			info: 'var(--info-color)',
			'info-lighter': 'var(--info-color-lighter)',
			'info-darker': 'var(--info-color-darker)',
			default: 'var(--default-color)',
			'default-lighter': 'var(--default-color-lighter)',
			'default-darker': 'var(--default-color-darker)',
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

const THEME_CONFIG: OverriddenThemeOptions = {
	palette: { type: 'dark' },
	overrides: {
		MuiRating: {
			root: {
				// allows rating icons to move to the new lines
				flexWrap: 'wrap',
				// adds spacing in between the rows when moved to a new line
				rowGap: 10,
			},
		},
	},
};

// eslint-disable-next-line camelcase
const themeFn = __IS_DEV__ ? unstable_createMuiStrictModeTheme : createMuiTheme;
const getMuiTheme = () => {
	return responsiveFontSizes(themeFn(THEME_CONFIG));
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
			return `
				${acc}${colorKey}: ${colorValue};
				${colorKey}-lighter: ${lighten(0.15, colorValue)};
				${colorKey}-darker: ${fade(colorValue, 0.05)};
			`;
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
	}

	/* TODO: These will be removed once a proper UI is in place */
	/* #region OVERRIDES */
	div {
		color: white;
	}
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
`;

export { getMuiTheme, GlobalStyles };
export default theme;
