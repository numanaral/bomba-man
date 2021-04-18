import produce from 'immer';
import { Reducer } from 'redux';
import { updateImmerDraft } from 'utils/immer';
import { DEFAULT_VALUES, SET_GAME_STATE } from './constants';
import { GameAction, GameState } from './types';

const gameReducer: Reducer<GameState, GameAction> = (
	state = DEFAULT_VALUES,
	action
) =>
	produce(state, draft => {
		switch (action.type) {
			case SET_GAME_STATE:
				updateImmerDraft(draft, action.payload!);
				break;
			default:
				// No default
				break;
		}
	});

export default gameReducer;
