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
} from 'store/redux/reducers/game/actions';
import { GameState, OnExplosionProps } from 'store/redux/reducers/game/types';
import { generateRandomGameMap, handleExplosionOnGameMap } from 'utils/game';
import {
	makeSelectGameMap,
	makeSelectGameSize,
} from 'store/redux/reducers/game/selectors';
import config from 'config';
import { GameMap } from 'containers/Game/types';

const useGameProvider = () => {
	const dispatch = useDispatch();
	const gameSize = useSelector(makeSelectGameSize());
	const gameMap = useSelector(makeSelectGameMap());

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
	const makeMove = useCallback(props => dispatch(makeMoveInGame(props)), [
		dispatch,
	]);

	const dropBomb = useCallback(props => dispatch(dropBombInGame(props)), [
		dispatch,
	]);

	const removeBomb = useCallback(
		bombId => dispatch(removeBombFromGame(bombId)),
		[dispatch]
	);

	const onExplosion = useCallback(
		({ bombId, bombCoordinates }: OnExplosionProps) => {
			debugger;
			// TODO: batch or merge
			removeBomb(bombId);
			const newMap = handleExplosionOnGameMap(
				gameMap,
				bombCoordinates,
				config.size.explosion
			);
			updateGameMap(newMap);
		},
		[gameMap, removeBomb, updateGameMap]
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
		dropBomb,
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
