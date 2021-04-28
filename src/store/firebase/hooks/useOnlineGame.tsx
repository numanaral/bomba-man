import {
	// isEmpty,
	// isLoaded,
	useFirebase,
	useFirebaseConnect,
} from 'react-redux-firebase';
import { useSelector } from 'react-redux';

import useAuth from 'store/firebase/hooks/useAuth';
import { fromFirestore, toFirestore } from 'store/firebase/utils';
import { makeSelectOnlineGame } from 'store/redux/reducers/firebase/selectors';
import { GameState } from 'store/redux/reducers/game/types';
// TODO: react-router
// import LoadingIndicator from 'components/LoadingIndicator';
// import NoAccess from 'components/NoAccess';
// TODO: notification-provider
// import useNotificationProvider from 'store/redux/hooks/useNotificationProvider';

const useOnlineGame = (id: string) => {
	// const { notifyError } = useNotificationProvider();
	const { userId } = useAuth();
	const firebase = useFirebase();
	useFirebaseConnect({
		path: `online/${id}`,
	});

	const onlineGameFromFirebase = useSelector(makeSelectOnlineGame(id));

	// const pending = !isLoaded(liveOptionsFromFirebase) && <LoadingIndicator />;
	// const error = isEmpty(liveOptionsFromFirebase) && <NoAccess />;

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

	return {
		onlineGame,
		createOnlineGame,
		updateOnlineGame,
		deleteOnlineGame,
		pending,
		// error,
	};
};

export default useOnlineGame;
