import configureStore from 'store/redux';
import { __IS_DEV__ } from 'app';
import { getReactReduxFirebaseProps } from 'store/firebase';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import ThemeProvider from 'containers/ThemeProvider';
import './created-by-numan';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from 'routes';
import Links from './Links';

const store = configureStore();
// @ts-ignore
if (__IS_DEV__) window.__redux_store = store;

const App = () => {
	return (
		<StoreProvider store={store}>
			<div id="created-by-numan" />
			<ReactReduxFirebaseProvider {...getReactReduxFirebaseProps(store)}>
				<ThemeProvider>
					<Router>
						<Links />
						<Routes />
					</Router>
				</ThemeProvider>
				<div id="created-by-numan" />
			</ReactReduxFirebaseProvider>
		</StoreProvider>
	);
};

export default App;
