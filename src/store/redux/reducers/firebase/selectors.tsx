import { createSelector, Selector } from 'reselect';
import { Store } from 'store/redux/types';
import { FirebaseState } from './types';

// Direct selector to the userPreferences state
const selectFirebase: Selector<Store, FirebaseState> = state => {
	return state.firebase;
};

// Other specific selectors
const makeSelectAuth = () => {
	return createSelector(selectFirebase, ({ auth }) => auth);
};

const makeSelectProfile = () => {
	return createSelector(selectFirebase, ({ profile }) => profile);
};

const makeSelectOnline = () => {
	return createSelector(selectFirebase, ({ data: { online } }) => online);
};

const makeSelectOnlineGame = (id: string) => {
	return createSelector(
		selectFirebase,
		({ data: { online } }) => online && online[id]
	);
};

// Default selector
const makeSelectFirebase = () => {
	return createSelector(selectFirebase, state => state);
};

export {
	selectFirebase,
	makeSelectAuth,
	makeSelectProfile,
	makeSelectOnline,
	makeSelectOnlineGame,
};
export default makeSelectFirebase;
