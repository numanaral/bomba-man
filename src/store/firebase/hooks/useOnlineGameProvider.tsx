// import useAuth from 'store/firebase/hooks/useAuth';
// TODO: react-router
// import LoadingIndicator from 'components/LoadingIndicator';
// import NoAccess from 'components/NoAccess';
// TODO: notification-provider
// import useNotificationProvider from 'store/redux/hooks/useNotificationProvider';
import {
	AnimatableGameMap,
	BombFn,
	BombId,
	GameState,
	OnMoveProps,
	OnTriggerMove,
} from 'store/redux/reducers/game/types';
import { generateRandomGameMap } from 'utils/game';
import { OnDropBomb } from 'containers/Game/types';
import GameUtils from 'api/GameUtils';
import OnlineGameUpdater from 'api/OnlineGameUpdater';
import { useCallback, useEffect, useRef } from 'react';
import useFirebaseUtils from './useFirebaseUtils';

const useOnlineGameProvider = (gameId: string, gameState: GameState) => {
	const updaters = useFirebaseUtils<GameState>(`online/${gameId}`);
	// const { notifyError } = useNotificationProvider();
	// const { userId } = useAuth();

	const gameUpdater = useRef(new OnlineGameUpdater(gameState, updaters));
	const gameUtils = useRef(new GameUtils(gameState, gameUpdater.current));
	const state = useRef(gameState);

	useEffect(() => {
		gameUpdater.current = new OnlineGameUpdater(gameState, updaters);
		gameUtils.current = new GameUtils(gameState, gameUpdater.current);
	}, [gameState, updaters]);

	const updateGameSettings = useCallback((props: GameState) => {
		gameUpdater.current.updateGameState(props);
	}, []);

	const updateGameMap = useCallback((props: AnimatableGameMap) => {
		gameUpdater.current.updateGameMap(props);
	}, []);

	const generateNewCollisionCoordinates = useCallback(() => {
		updateGameMap({
			gameMap: generateRandomGameMap(
				state.current.config.sizes.map,
				state.current.config.tiles.blockTileChance
			),
			animate: true,
		});
	}, [updateGameMap]);

	const makeMove = useCallback((props: OnMoveProps) => {
		gameUtils.current.makeMove(props);
	}, []);

	const triggerMove = useCallback<OnTriggerMove>(
		props => {
			gameUtils.current.triggerMove({
				...props,
				onComplete: makeMove,
			});
		},
		[gameUtils, makeMove]
	);

	const dropBomb = useCallback<OnDropBomb>(props => {
		gameUtils.current.dropBomb(props);
	}, []);

	const triggerExplosion = useCallback<BombFn>((props, cb) => {
		console.log(state.current.players.P1?.coordinates);
		gameUtils.current.triggerExplosion(props, cb);
	}, []);

	const onExplosionComplete = useCallback((props: BombId) => {
		gameUtils.current.onExplosionComplete(props);
	}, []);

	const triggerAnimation = useCallback(() => {
		gameUtils.current.triggerGameAnimation();
	}, []);

	const toggleDimension = useCallback(() => {
		gameUtils.current.toggleGameDimension();
	}, []);

	const togglePerspective = useCallback(() => {
		gameUtils.current.toggleGamePerspective();
	}, []);

	const toggleTwoPlayer = useCallback(() => {
		gameUtils.current.toggleGameTwoPlayer();
	}, []);

	const toggleNPC = useCallback(() => {
		gameUtils.current.toggleGameNpc();
	}, []);

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
