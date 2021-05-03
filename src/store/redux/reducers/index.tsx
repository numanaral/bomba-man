import { combineReducers } from 'redux';
import { Store } from '../types';
import gameReducer, { gameKey } from './game';

const rootReducer = combineReducers<Store>({
	[gameKey]: gameReducer,
});

export default rootReducer;
