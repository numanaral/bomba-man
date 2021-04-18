import { createSelector, Selector } from 'reselect';
import { Store } from 'store/redux/types';
import { DEFAULT_VALUES, KEY } from './constants';
import { GameState } from './types';

// Direct selector to the visible state
const selectGameProps: Selector<Store, GameState> = state => {
	return state[KEY] || DEFAULT_VALUES;
};

// Other specific selectors

// Default selector
const makeSelectDialogProps = () => {
	return createSelector(selectGameProps, modalPropsState => modalPropsState);
};

export { selectGameProps };
export default makeSelectDialogProps;
