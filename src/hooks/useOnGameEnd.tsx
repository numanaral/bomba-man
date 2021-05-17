import { GameEnd, OnlineGameId, PlayerId } from 'containers/Game/types';
import { GameEndCondition, PlayerCondition } from 'enums';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { BASE_PATH } from 'routes/constants';
import { ReactRouterState } from 'routes/types';
import { GameConfig } from 'store/redux/reducers/game/types';

const useOnGameEnd = (
	players: GameEnd['players'],
	currentOnlinePlayerId?: PlayerId,
	gameId?: OnlineGameId,
	gameConfig?: GameConfig
) => {
	const { push } = useHistory<ReactRouterState>();

	let gameEndCondition = GameEndCondition.Lose;
	if (players && currentOnlinePlayerId) {
		gameEndCondition =
			players[currentOnlinePlayerId] === PlayerCondition.Alive
				? GameEndCondition.Win
				: GameEndCondition.Lose;
	}

	useEffect(() => {
		const alivePlayers = Object.values(players).filter(
			playerCondition => playerCondition === PlayerCondition.Alive
		);

		if (alivePlayers.length > 1) return;

		push(`${BASE_PATH}/game-end/${gameId}`, {
			endGame: {
				players,
				currentOnlinePlayerId,
				gameEndCondition,
			},
			gameConfig,
			playerId: currentOnlinePlayerId,
		});
	}, [
		currentOnlinePlayerId,
		gameConfig,
		gameEndCondition,
		gameId,
		players,
		push,
	]);
};

export default useOnGameEnd;
