import { createSelector, Selector } from 'reselect';
import { Store } from 'store/redux/types';
import { KEY } from './constants';
import { GameState } from './types';

// Direct selector to the visible state
const selectGameProps: Selector<Store, GameState> = state => {
	return state[KEY];
};

// Other specific selectors
// #region GAME ACTION STATES
const makeSelectGamePlayers = () => {
	return createSelector(selectGameProps, ({ players }) => players);
};

const makeSelectGameBombs = () => {
	return createSelector(selectGameProps, ({ bombs }) => bombs);
};
// //#endregion

// #region GAME SETTINGS
const makeSelectGameConfig = () => {
	return createSelector(selectGameProps, ({ config }) => config);
};

const makeSelectGameIs3D = () => {
	return createSelector(selectGameProps, ({ is3D }) => is3D);
};

const makeSelectGameIsSideView = () => {
	return createSelector(selectGameProps, ({ isSideView }) => isSideView);
};

const makeSelectGameMap = () => {
	return createSelector(selectGameProps, ({ gameMap }) => gameMap);
};

const makeSelectGameAnimationCounter = () => {
	return createSelector(
		selectGameProps,
		({ animationCounter }) => animationCounter
	);
};
// #endregion

// Default selector
const makeSelectGameState = () => {
	return createSelector(selectGameProps, state => state);
};

export {
	selectGameProps,
	// GAME ACTION STATES
	makeSelectGamePlayers,
	makeSelectGameBombs,
	// GAME SETTINGS
	makeSelectGameConfig,
	makeSelectGameIs3D,
	makeSelectGameIsSideView,
	makeSelectGameMap,
	makeSelectGameAnimationCounter,
};
export default makeSelectGameState;
