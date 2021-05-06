import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import { Store } from '../types';
import gameReducer, { gameKey } from './game';

const rootReducer = combineReducers<Store>({
	firebase: firebaseReducer,
	firestore: firestoreReducer,
	[gameKey]: gameReducer,
});

export default rootReducer;
