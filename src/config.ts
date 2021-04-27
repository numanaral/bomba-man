import {
	PlayerKeyboardConfig,
	PlayerId,
	PowerUps,
} from 'containers/Game/types';
import { PowerUp } from 'enums';
import * as KeyCode from 'keycode-js';

const config = {
	title: 'Bomberman - Work In Progress',
	game: {
		blockDensity: 8 as RangeOf<10, 1>,
		powerUpChance: 5 as RangeOf<5, 1>,
		// Player defaults
		lives: 1, // number
		[PowerUp.Life]: 1, // number
		[PowerUp.BombCount]: 1, // number
		[PowerUp.BombSize]: 1, // number
		[PowerUp.MovementSpeed]: 200, // ms
		powerUps: {
			[PowerUp.Life]: 0, // number
			[PowerUp.BombCount]: 0, // number
			[PowerUp.BombSize]: 0, // number
			[PowerUp.MovementSpeed]: 0, // number
		} as PowerUps,
		powerUpIncreaseValue: {
			[PowerUp.Life]: 1, // number
			[PowerUp.BombCount]: 1, // number
			[PowerUp.BombSize]: 1, // number
			[PowerUp.MovementSpeed]: -50, // ms
		} as PowerUps,
	},
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
		// TODO: This and the one under "game" should be controlled
		movement: 200, // ms
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
