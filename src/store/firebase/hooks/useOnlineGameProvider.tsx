// import useAuth from 'store/firebase/hooks/useAuth';
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
import { OnDropBomb, PlayerId } from 'containers/Game/types';
import GameUtils from 'api/GameUtils';
import OnlineGameUpdater from 'api/OnlineGameUpdater';
import { useCallback, useEffect, useRef } from 'react';
import { Direction } from 'enums';
import useFirebaseUtils from './useFirebaseUtils';

const useOnlineGameProvider = (gameId: string, gameState: GameState) => {
	const updaters = useFirebaseUtils<GameState>(`online/${gameId}/gameState`);
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
				state.current.config.sizes,
				state.current.config.tiles.blockTileChance,
				state.current.players
			),
			animate: true,
		});
	}, [updateGameMap]);

	const updatePlayerDirection = useCallback(
		(direction: Direction, id: PlayerId) => {
			gameUtils.current.updatePlayerDirection({ direction, id });
		},
		[]
	);

	const updatePlayerIsWalking = useCallback(
		(isWalking: boolean, id: PlayerId) => {
			gameUtils.current.updatePlayerIsWalking({ isWalking, id });
		},
		[]
	);

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

	const startGame = () => null;

	return {
		startGame,
		updateGameSettings,
		generateNewCollisionCoordinates,
		// GAME ACTIONS
		updatePlayerDirection,
		updatePlayerIsWalking,
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
