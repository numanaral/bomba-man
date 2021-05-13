import { GameApiHookLocal, PlayerId } from 'containers/Game/types';
import { GameType, PlayerCondition } from 'enums';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { BASE_PATH } from 'routes/constants';
import makeSelectGameState from '../reducers/game/selectors';
import useGameProvider from './useGameProvider';

const useLocalGame: GameApiHookLocal = gameConfig => {
	const { push } = useHistory();
	const provider = useGameProvider();
	const state = useSelector(makeSelectGameState());

	const gameStarted = useRef(false);

	useEffect(() => {
		if (gameStarted.current) return;
		if (!gameConfig) return;
		provider.startGame(gameConfig);
		gameStarted.current = true;
	});

	if (!gameConfig) {
		push(`${BASE_PATH}/room-creator/local`);
		return null; // to satisfy lint
	}

	return {
		provider,
		state,
		type: GameType.Local,
		gamePlayers: Object.keys(state.players).reduce<
			Record<PlayerId, PlayerCondition>
		>((acc, playerId) => {
			acc[playerId as PlayerId] = PlayerCondition.Alive;
			return acc;
		}, {} as Record<PlayerId, PlayerCondition>),
	};
};

export default useLocalGame;
