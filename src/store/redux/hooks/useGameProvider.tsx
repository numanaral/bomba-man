import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	setGameState,
	setGameMap,
	triggerGameAnimation,
	toggleGamePerspective,
	toggleGameDimension,
	toggleGameNPC,
	toggleGameTwoPlayer,
	removeBombFromGame,
	makeMoveInGame,
	setPlayerRefInGame,
	dropBombInGame,
	onExplosionComplete,
	triggerMoveInGame,
} from 'store/redux/reducers/game/actions';
import {
	GameState,
	OnMoveProps,
	OnTriggerMove,
} from 'store/redux/reducers/game/types';
import { generateRandomGameMap } from 'utils/game';
import { makeSelectGameSize } from 'store/redux/reducers/game/selectors';
import { GameMap } from 'containers/Game/types';

const useGameProvider = () => {
	const dispatch = useDispatch();
	const gameSize = useSelector(makeSelectGameSize());

	const updateGameSettings = useCallback(
		(payload: GameState) => dispatch(setGameState(payload)),
		[dispatch]
	);

	const updateGameMap = useCallback(
		(newMap: GameMap, animate = false) =>
			dispatch(setGameMap({ gameMap: newMap, animate })),
		[dispatch]
	);

	const generateNewCollisionCoordinates = useCallback(
		() => updateGameMap(generateRandomGameMap(gameSize), true),
		[gameSize, updateGameMap]
	);

	const setPlayerRef = useCallback(
		props => dispatch(setPlayerRefInGame(props)),
		[dispatch]
	);

	// #region GAME ACTIONS
	const makeMove = useCallback(
		(props: OnMoveProps) => dispatch(makeMoveInGame(props)),
		[dispatch]
	);

	const triggerMove = useCallback<OnTriggerMove>(
		props =>
			dispatch(
				triggerMoveInGame({
					...props,
					onComplete: makeMove,
				})
			),
		[dispatch, makeMove]
	);

	const dropBomb = useCallback(props => dispatch(dropBombInGame(props)), [
		dispatch,
	]);

	const removeBomb = useCallback(
		bombId => dispatch(removeBombFromGame(bombId)),
		[dispatch]
	);

	const onExplosion = useCallback(
		props => {
			dispatch(onExplosionComplete(props));
		},
		[dispatch]
	);
	// #endregion

	// #region GAME SETTINGS
	const triggerAnimation = useCallback(
		() => dispatch(triggerGameAnimation()),
		[dispatch]
	);

	const toggleDimension = useCallback(() => dispatch(toggleGameDimension()), [
		dispatch,
	]);

	const togglePerspective = useCallback(
		() => dispatch(toggleGamePerspective()),
		[dispatch]
	);

	const toggleTwoPlayer = useCallback(() => dispatch(toggleGameTwoPlayer()), [
		dispatch,
	]);

	const toggleNPC = useCallback(() => dispatch(toggleGameNPC()), [dispatch]);
	// #endregion

	return {
		updateGameSettings,
		generateNewCollisionCoordinates,
		setPlayerRef,
		// GAME ACTIONS
		makeMove,
		triggerMove,
		dropBomb,
		removeBomb,
		onExplosion,
		// GAME SETTINGS
		triggerAnimation,
		toggleDimension,
		togglePerspective,
		toggleTwoPlayer,
		toggleNPC,
	};
};

export default useGameProvider;