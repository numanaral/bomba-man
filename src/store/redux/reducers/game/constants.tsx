import { playerGenerator } from 'utils/game';
import { GameState } from './types';

// Defaults
const KEY = 'Game';
const DEFAULT_VALUES: GameState = {
	players: {
		...playerGenerator('P1', 0, 0),
	},
	gameMap: [[]],
};

// Types
const SET_GAME_STATE = `${KEY}/SET_GAME_STATE`;

export { KEY, DEFAULT_VALUES, SET_GAME_STATE };
