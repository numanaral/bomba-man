import { createSelector, Selector } from 'reselect';
import { Store } from 'store/redux/types';
import { FirestoreState } from './types';

// Direct selector to the userPreferences state
const selectFirestore: Selector<Store, FirestoreState> = state => {
	return state.firestore;
};

// // Other specific selectors

// Default selector
const makeSelectFirestore = () => {
	return createSelector(selectFirestore, state => state);
};

export { selectFirestore };
export default makeSelectFirestore;
