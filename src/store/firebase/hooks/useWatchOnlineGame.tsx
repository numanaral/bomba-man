import {
	isEmpty,
	isLoaded,
	useFirebase,
	useFirebaseConnect,
} from 'react-redux-firebase';
import { useSelector } from 'react-redux';

import useAuth from 'store/firebase/hooks/useAuth';
import { fromFirestore, toFirestore } from 'store/firebase/utils';
import { makeSelectOnlineGame } from 'store/redux/reducers/firebase/selectors';
import { GameState } from 'store/redux/reducers/game/types';
import { generateDefaultGameState } from 'utils/game';
// import { generateRandomGameMap } from 'utils/game';
// import config from 'config';
// TODO: react-router
// import LoadingIndicator from 'components/LoadingIndicator';
// import NoAccess from 'components/NoAccess';
// TODO: notification-provider
// import useNotificationProvider from 'store/redux/hooks/useNotificationProvider';

const LoadingIndicator = () => <>LoadingIndicator</>;
const NoAccess = () => <>NoAccess</>;

const defaultGameState = generateDefaultGameState();

const useWatchOnlineGame = (id: string) => {
	// const { notifyError } = useNotificationProvider();
	const { userId } = useAuth();
	const firebase = useFirebase();
	useFirebaseConnect(`online/${id}`);

	const onlineGameFromFirebase = useSelector(makeSelectOnlineGame(id));

	const pending = !isLoaded(onlineGameFromFirebase) && <LoadingIndicator />;
	const error = isEmpty(onlineGameFromFirebase) && <NoAccess />;

	const onlineGame =
		(onlineGameFromFirebase && fromFirestore(onlineGameFromFirebase)) || [];

	const createOnlineGame = async (props: GameState, gameId: string = id) => {
		try {
			await firebase.set(
				`online/${gameId}`,
				toFirestore({
					...props,
					userId,
					// extra props
				})
			);
		} catch (err) {
			// notifyError(err);
		}
	};

	const updateOnlineGame = async (props: Partial<GameState>) => {
		try {
			await firebase.update(`online/${id}`, toFirestore(props));
		} catch (err) {
			// notifyError(err);
		}
	};

	const deleteOnlineGame = async () => {
		try {
			await firebase.remove(`online/${id}`);
		} catch (err) {
			// notifyError(err);
		}
	};

	const gameState: GameState = {
		players: onlineGame.players || {},
		// gameMap: onlineGame.gameMap || generateRandomGameMap(config.size.game),
		gameMap: onlineGame.gameMap || {},
		bombs: onlineGame.bombs || {},
		powerUps: onlineGame.powerUps || {},
		is3D: onlineGame.is3D || false,
		isSideView: onlineGame.isSideView || false,
		size: onlineGame.size || 15,
		animationCounter: onlineGame.animationCounter || 0,
		config: defaultGameState.config,
	};

	return {
		gameState,
		createOnlineGame,
		updateOnlineGame,
		deleteOnlineGame,
		pending,
		error,
	};
};

export default useWatchOnlineGame;
