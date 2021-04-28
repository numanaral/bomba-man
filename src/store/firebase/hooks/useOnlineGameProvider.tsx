// import useAuth from 'store/firebase/hooks/useAuth';
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
import { GameMap, OnDropBomb, PlayerConfig } from 'containers/Game/types';
import { PLAYERS } from 'store/redux/reducers/game/constants';
import useOnlineGame from './useOnlineGame';
import useFirebaseUtils from './useFirebaseUtils';

const useOnlineGameProvider = (id: string) => {
	const { create, remove, update } = useFirebaseUtils<GameState>(
		`online/${id}`
	);
	// const { notifyError } = useNotificationProvider();
	// const { userId } = useAuth();
	const { gameState, pending: _, error: __ } = useOnlineGame(id);

	const {
		size: gameSize,
		animationCounter,
		is3D,
		isSideView,
		players,
	} = gameState;
	const { P2, P4 } = players;

	// #region GAME SETTINGS
	const triggerAnimation = async () => {
		update({
			animationCounter: animationCounter + 1,
		});
	};

	const toggleDimension = async () => {
		update({
			is3D: !is3D,
		});
	};

	const togglePerspective = async () => {
		update({
			isSideView: !isSideView,
		});
	};

	const toggleTwoPlayer = async () => {
		const playerRef = '/players/P2';
		if (P2) {
			remove(playerRef);
			return;
		}

		create<PlayerConfig>(
			{
				...PLAYERS.P2,
				keyboardConfig: null,
			},
			playerRef
		);
	};

	const toggleNPC = async () => {
		const playerRef = '/players/P4';
		if (P4) {
			remove(playerRef);
			return;
		}

		create<PlayerConfig>(
			{
				...PLAYERS.P4,
				keyboardConfig: null,
			},
			playerRef
		);
	};

	const updateGameSettings = async (newProps: Partial<GameState>) => {
		update(newProps);
	};

	const updateGameMap = async (newGameMap: GameMap, animate = false) => {
		// NOTE: Should we do a diff here and only update what's necessary?
		// we aren't sending huge data but should check this out later
		update({ gameMap: newGameMap });
		if (!animate) triggerAnimation();
	};

	const generateNewCollisionCoordinates = async () => {
		updateGameMap(generateRandomGameMap(gameSize), true);
	};
	// #endregion

	// #region GAME ACTIONS
	const makeMove = async (props: OnMoveProps) => {
		// update({ newProps });
		console.log('makeMoveInGame(props)', props);
	};

	const triggerMove: OnTriggerMove = async props => {
		// update({ newProps });
		console.log(
			`triggerMoveInGame({
					...props,
					onComplete: makeMove,
				})`,
			props
		);
	};

	const dropBomb: OnDropBomb = async props => {
		// update({ newProps });
		console.log('dropBombInGame(playerId)', props);
	};

	const triggerExplosion: BombFn = async (props, cb) => {
		// update({ newProps });
		console.log('triggerExplosionInGame(bombId, cb)', props, cb);
	};

	const onExplosionComplete = async (bombId: BombId) => {
		// update({ newProps });
		console.log('onExplosionCompleteInGame(bombId)', bombId);
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
