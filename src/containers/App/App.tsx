// import Container from 'components/Container';
// import Game from 'containers/Game';
import { GlobalStyles } from 'theme';
import { Provider as StoreProvider } from 'react-redux';
import configureStore from 'store/redux';
import { __IS_DEV__ } from 'app';
// import LoadingIndicator from 'components/LoadingIndicator';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from 'routes';
import Links from './Links';

const initialState = {};
const store = configureStore(initialState);
// @ts-ignore
if (__IS_DEV__) window.__redux_store = store;

const App = () => {
	return (
		<StoreProvider store={store}>
			<Router>
				<Links />
				<Routes />
			</Router>
			{/* <Container> */}
			{/* <Game /> */}
			{/* </Container> */}
			{/* <LoadingIndicator /> */}
			<div id="created-by-numan" />
			<GlobalStyles />
		</StoreProvider>
	);
};

export default App;
