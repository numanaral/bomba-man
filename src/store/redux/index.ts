import { createStore, applyMiddleware, PreloadedState } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import rootReducer from './reducers';

const configureStore = <Store>(initialState: PreloadedState<Store>) => {
	// Create the store with two middlewares
	// thunkMiddleware: Handle async calls
	const middleware = [thunkMiddleware];
	const enhancer = applyMiddleware(...middleware);

	const store = createStore(
		rootReducer,
		initialState,
		composeWithDevTools(enhancer)
	);

	// Hot reload the store
	if (process.env.NODE_ENV !== 'production' && module.hot) {
		module.hot.accept('./reducers', () => {
			store.replaceReducer(rootReducer);
		});
	}

	return store;
};

export default configureStore;
