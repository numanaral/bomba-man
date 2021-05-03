import { createSelector, Selector } from 'reselect';
import { Store } from 'store/redux/types';
import { DEFAULT_VALUES, KEY } from './constants';
import { GameState } from './types';

// Direct selector to the visible state
const selectGameProps: Selector<Store, GameState> = state => {
	return state[KEY] || DEFAULT_VALUES;
};

// Other specific selectors
// #region GAME ACTION STATES
const makeSelectGamePlayers = () =>
	createSelector(selectGameProps, ({ players }) => players);

const makeSelectGameBombs = () =>
	createSelector(selectGameProps, ({ bombs }) => bombs);
// //#endregion

// #region GAME SETTINGS
const makeSelectGameIs3D = () =>
	createSelector(selectGameProps, ({ is3D }) => is3D);

const makeSelectGameIsSideView = () =>
	createSelector(selectGameProps, ({ isSideView }) => isSideView);

const makeSelectGameMap = () =>
	createSelector(selectGameProps, ({ gameMap }) => gameMap);

const makeSelectGameSize = () =>
	createSelector(selectGameProps, ({ size }) => size);

const makeSelectGameAnimationCounter = () =>
	createSelector(selectGameProps, ({ animationCounter }) => animationCounter);
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
	makeSelectGameIs3D,
	makeSelectGameIsSideView,
	makeSelectGameMap,
	makeSelectGameSize,
	makeSelectGameAnimationCounter,
};
export default makeSelectGameState;
