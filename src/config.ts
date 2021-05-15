import { KeyboardConfig } from 'containers/Game/types';
// import { PowerUp } from 'enums';
import * as KeyCode from 'keycode-js';

const config = {
	title: 'Bomba-man',
	// powerUps: {
	// 	[PowerUp.Life]: 0, // number
	// 	[PowerUp.BombCount]: 0, // number
	// 	[PowerUp.BombSize]: 0, // number
	// 	[PowerUp.MovementSpeed]: 0, // number
	// } as PowerUps,
	keyboardConfig: {
		0: {
			MoveUp: KeyCode.CODE_W,
			MoveRight: KeyCode.CODE_D,
			MoveDown: KeyCode.CODE_S,
			MoveLeft: KeyCode.CODE_A,
			DropBomb: KeyCode.CODE_SPACE,
		},
		1: {
			MoveUp: KeyCode.CODE_UP,
			MoveRight: KeyCode.CODE_RIGHT,
			MoveDown: KeyCode.CODE_DOWN,
			MoveLeft: KeyCode.CODE_LEFT,
			DropBomb: KeyCode.CODE_SEMICOLON,
		},
	} as NonNullable<KeyboardConfig>,
};

export default config;
