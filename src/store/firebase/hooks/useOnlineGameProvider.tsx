import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';
// import useAuth from 'store/firebase/hooks/useAuth';
import { toFirestore } from 'store/firebase/utils';
// TODO: react-router
// import LoadingIndicator from 'components/LoadingIndicator';
// import NoAccess from 'components/NoAccess';
// TODO: notification-provider
// import useNotificationProvider from 'store/redux/hooks/useNotificationProvider';
import {
	BombFn,
	BombId,
	GameState,
	OnMoveProps,
	OnTriggerMove,
} from 'store/redux/reducers/game/types';
import { generateRandomGameMap } from 'utils/game';
import { GameMap, OnDropBomb } from 'containers/Game/types';
import { PLAYERS } from 'store/redux/reducers/game/constants';
import useOnlineGame from './useOnlineGame';

const useOnlineGameProvider = (id: string) => {
	// const { notifyError } = useNotificationProvider();
	// const { userId } = useAuth();
	const firebase = useFirebase();
	useFirebaseConnect([`online/${id}`]);

	const { gameState, pending: _, error: __ } = useOnlineGame(id);

	const {
		size: gameSize,
		animationCounter,
		is3D,
		isSideView,
		players,
	} = gameState;
	const { P2, P4 } = players;

	const updateGameSettings = async (props: Partial<GameState>) => {
		try {
			await firebase.update(`online/${id}`, toFirestore(props));
		} catch (err) {
			// notifyError(err);
		}
	};

	const updateGameMap = async (newMap: GameMap, animate = false) => {
		try {
			await firebase.update(`online/${id}/gameMap`, newMap);
			if (animate) {
				await firebase.update(
					`online/${id}/animationCounter`,
					animationCounter + 1
				);
			}
		} catch (err) {
			// notifyError(err);
		}
	};

	const generateNewCollisionCoordinates = async () => {
		updateGameMap(generateRandomGameMap(gameSize), true);
	};

	// #region GAME ACTIONS
	const makeMove = async (props: OnMoveProps) => {
		try {
			console.log('makeMoveInGame(props)', props);
			// await firebase.update(`online/${id}`, toFirestore(props));
		} catch (err) {
			// notifyError(err);
		}
	};

	const triggerMove: OnTriggerMove = async props => {
		try {
			console.log(
				`triggerMoveInGame({
					...props,
					onComplete: makeMove,
				})`,
				props
			);
			// await firebase.update(`online/${id}`, toFirestore(props));
		} catch (err) {
			// notifyError(err);
		}
	};

	const dropBomb: OnDropBomb = async props => {
		try {
			console.log('dropBombInGame(playerId)', props);
			// await firebase.update(`online/${id}`, toFirestore(props));
		} catch (err) {
			// notifyError(err);
		}
	};

	const triggerExplosion: BombFn = async (props, cb) => {
		try {
			console.log('triggerExplosionInGame(bombId, cb)', props, cb);
			// await firebase.update(`online/${id}`, toFirestore(props));
		} catch (err) {
			// notifyError(err);
		}
	};

	const onExplosionComplete = async (bombId: BombId) => {
		try {
			console.log('onExplosionCompleteInGame(bombId)', bombId);
			// await firebase.update(`online/${id}`, toFirestore(props));
		} catch (err) {
			// notifyError(err);
		}
	};
	// #endregion

	// #region GAME SETTINGS
	const triggerAnimation = async () => {
		try {
			await firebase.update(
				`online/${id}/animationCounter`,
				animationCounter + 1
			);
		} catch (err) {
			// notifyError(err);
		}
	};

	const toggleDimension = async () => {
		try {
			await firebase.update(
				`online/${id}`,
				toFirestore<GameState>({
					is3D: !is3D,
				})
			);
		} catch (err) {
			// notifyError(err);
		}
	};

	const togglePerspective = async () => {
		try {
			await firebase.update(
				`online/${id}`,
				toFirestore<GameState>({
					isSideView: !isSideView,
				})
			);
		} catch (err) {
			// notifyError(err);
		}
	};

	const toggleTwoPlayer = async () => {
		try {
			if (P2) {
				await firebase.remove(`online/${id}/players/P2`);
				return;
			}

			await firebase.set(`online/${id}/players/P2`, {
				...PLAYERS.P2,
				keyboardConfig: null,
			});
		} catch (err) {
			// notifyError(err);
		}
	};

	const toggleNPC = async () => {
		try {
			if (P4) {
				await firebase.remove(`online/${id}/players/P4`);
				return;
			}

			await firebase.set(`online/${id}/players/P4`, {
				...PLAYERS.P4,
				keyboardConfig: null,
			});
		} catch (err) {
			console.log('err', err);
			// notifyError(err);
		}
	};
	// #endregion

	return {
		updateGameSettings,
		generateNewCollisionCoordinates,
		// GAME ACTIONS
		makeMove,
		triggerMove,
		dropBomb,
		triggerExplosion,
		onExplosionComplete,
		// GAME SETTINGS
		triggerAnimation,
		toggleDimension,
		togglePerspective,
		toggleTwoPlayer,
		toggleNPC,
	};
};

export default useOnlineGameProvider;
