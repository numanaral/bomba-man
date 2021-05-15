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
	makeMoveInGame,
	dropBombInGame,
	onExplosionCompleteInGame,
	triggerMoveInGame,
	triggerExplosionInGame,
	changePlayerDirectionInGame,
	changePlayerIsWalkingInGame,
} from 'store/redux/reducers/game/actions';
import {
	AnimatableGameMap,
	BombFn,
	BombId,
	GameConfig,
	GameState,
	OnMoveProps,
	OnTriggerMove,
} from 'store/redux/reducers/game/types';
import { generateDefaultGameState, generateRandomGameMap } from 'utils/game';
import {
	makeSelectGameConfig,
	makeSelectGamePlayers,
} from 'store/redux/reducers/game/selectors';
import { OnDropBomb, PlayerId } from 'containers/Game/types';
import { Direction } from 'enums';

const useGameProvider = () => {
	const dispatch = useDispatch();
	const {
		sizes,
		tiles: { blockTileChance },
	} = useSelector(makeSelectGameConfig());
	const players = useSelector(makeSelectGamePlayers());

	const updateGameSettings = useCallback(
		(payload: GameState) => dispatch(setGameState(payload)),
		[dispatch]
	);

	const startGame = useCallback(
		(payload: GameConfig) => {
			const gameState = generateDefaultGameState(payload);
			updateGameSettings(gameState);
		},
		[updateGameSettings]
	);

	const updateGameMap = useCallback(
		(props: AnimatableGameMap) => dispatch(setGameMap(props)),
		[dispatch]
	);

	const generateNewCollisionCoordinates = useCallback(
		() =>
			updateGameMap({
				gameMap: generateRandomGameMap(sizes, blockTileChance, players),
				animate: true,
			}),
		[blockTileChance, sizes, players, updateGameMap]
	);

	// #region GAME ACTIONS
	const updatePlayerDirection = useCallback(
		(direction: Direction, id: PlayerId) => {
			dispatch(changePlayerDirectionInGame({ direction, id }));
		},
		[dispatch]
	);

	const updatePlayerIsWalking = useCallback(
		(isWalking: boolean, id: PlayerId) => {
			dispatch(changePlayerIsWalkingInGame({ isWalking, id }));
		},
		[dispatch]
	);

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

	const dropBomb = useCallback<OnDropBomb>(
		playerId => dispatch(dropBombInGame(playerId)),
		[dispatch]
	);

	const triggerExplosion = useCallback<BombFn>(
		(bombId, cb) => dispatch(triggerExplosionInGame(bombId, cb)),
		[dispatch]
	);

	const onExplosionComplete = useCallback(
		(bombId: BombId) => {
			dispatch(onExplosionCompleteInGame(bombId));
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

type GameProvider = ReturnType<typeof useGameProvider>;

export type { GameProvider };
export default useGameProvider;
