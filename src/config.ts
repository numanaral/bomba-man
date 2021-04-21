import { PlayerKeyboardConfig, PlayerId } from 'containers/Game/types';
import * as KeyCode from 'keycode-js';

const config = {
	title: 'Bomberman - Work In Progress',
	size: {
		game: 15 as RangeOf<15>, // squares
		character: 32, // px
		// ??!!: Size<title | movement> ?== Size<character>
		tile: 32, // px
		movement: 32, // px
		collisionMin: 1, // squares
		collisionMax: 1, // squares
		bomb: 16, // px
		explosion: 1, // square
	},
	duration: {
		movement: 300, // ms
		bomb: {
			firing: 2, // second
			exploding: 2, // second
		},
	},
	keyboardConfig: {
		player: {
			P1: {
				MoveUp: KeyCode.CODE_W,
				MoveRight: KeyCode.CODE_D,
				MoveDown: KeyCode.CODE_S,
				MoveLeft: KeyCode.CODE_A,
				DropBomb: KeyCode.CODE_SPACE,
			},
			P2: {
				MoveUp: KeyCode.CODE_UP,
				MoveRight: KeyCode.CODE_RIGHT,
				MoveDown: KeyCode.CODE_DOWN,
				MoveLeft: KeyCode.CODE_LEFT,
				DropBomb: KeyCode.CODE_SEMICOLON,
			},
		} as {
			[key in PlayerId]: PlayerKeyboardConfig;
			// TODO: MultiKeyboard 4-player local game, not needed for online
			// [PlayerNumber in RangeOf<4, 1>]: PlayerKeyboardConfig;
		},
	},
};

config.size.collisionMin = Math.floor(
	(config.size.game * config.size.game) / 3
);
config.size.collisionMax = Math.floor(
	(config.size.game * config.size.game) / 2
);

export default config;
