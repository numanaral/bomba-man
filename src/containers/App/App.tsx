import Container from 'components/Container';
import Game from 'containers/Game';
import { Provider as StoreProvider } from 'react-redux';
import configureStore from 'store/redux';
import { __IS_DEV__ } from 'app';
import useLocalGame from 'store/redux/hooks/useLocalGame';
import { getReactReduxFirebaseProps } from 'store/firebase';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import useOnlineGame from 'store/redux/hooks/useOnlineGame';
import ThemeProvider from 'containers/ThemeProvider';

const initialState = {};
const store = configureStore(initialState);
// @ts-ignore
if (__IS_DEV__) window.__redux_store = store;

const LocalGame = () => {
	const gameProps = useLocalGame();
	return <Game {...gameProps} />;
};

const OnlineGame = () => {
	const { pending, error, ...gameProps } = useOnlineGame('game1');
	return pending || error || <Game {...gameProps} />;
};

const ONLINE = true;
// const ONLINE = false;

const App = () => {
	return (
		<StoreProvider store={store}>
			<ReactReduxFirebaseProvider {...getReactReduxFirebaseProps(store)}>
				<ThemeProvider>
					<Container>
						{(ONLINE && <OnlineGame />) || <LocalGame />}
					</Container>
					<div id="created-by-numan" />
				</ThemeProvider>
			</ReactReduxFirebaseProvider>
		</StoreProvider>
	);
};

export default App;
