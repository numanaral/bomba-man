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
			supplementary: [
				'var(--supplementary-color-1)',
				'var(--supplementary-color-2)',
				'var(--supplementary-color-3)',
				'var(--supplementary-color-4)',
			],
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

		--primary-color: #86daff;
		--secondary-color: #763ee6;

		--supplementary-color-1: rgb(255, 122, 105);
		--supplementary-color-2: rgb(241, 168, 23);
		--supplementary-color-3: rgb(49, 162, 76);
		--supplementary-color-4: rgb(228, 230, 235);

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
