import { SET_GAME_STATE } from './constants';
import { GameActionFn } from './types';

const setGameState: GameActionFn = payload => ({
	type: SET_GAME_STATE,
	payload,
});

export { setGameState };
