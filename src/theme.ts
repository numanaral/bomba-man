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
	},
};

const GlobalStyles = createGlobalStyle`
	:root {
		/* Colors */
		--primary-background: #13141b;
		--secondary-background: #1a1d28;

		--primary-color: #ec7ebd;
		--secondary-color: #763ee6;

		--error-color: rgb(255, 122, 105);
		--warning-color: rgb(241, 168, 23);
		--success-color: rgb(49, 162, 76);
		--info-color: rgb(134, 218, 255);
		--default-color: rgb(228, 230, 235);

		/* Utilities */
		--border-radius: 4px;
		--padding: 10px;

		/* Game */
		--character-size: ${config.size.character}px;
		--tile-size: ${config.size.tile};
		--game-size: ${config.size.game};
	}
`;

export { GlobalStyles };
export default theme;
