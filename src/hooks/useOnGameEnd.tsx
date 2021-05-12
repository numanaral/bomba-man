import { GameEnd, PlayerId } from 'containers/Game/types';
import { GameEndCondition, PlayerCondition } from 'enums';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { BASE_PATH } from 'routes/constants';
import { ReactRouterState } from 'routes/types';

const useOnGameEnd = (
	players: GameEnd['players'],
	currentOnlinePlayerId?: PlayerId
) => {
	const { push } = useHistory<ReactRouterState>();

	let endGameCondition = GameEndCondition.Lose;
	if (players && currentOnlinePlayerId) {
		endGameCondition =
			players[currentOnlinePlayerId] === PlayerCondition.Alive
				? GameEndCondition.Win
				: GameEndCondition.Lose;
	}

	useEffect(() => {
		const alivePlayers = Object.values(players).filter(
			playerCondition => playerCondition === PlayerCondition.Alive
		);

		if (alivePlayers.length > 1) return;

		push(`${BASE_PATH}/end-game`, {
			endGame: {
				players,
				currentOnlinePlayerId,
				endGameCondition,
			},
		});
	}, [currentOnlinePlayerId, endGameCondition, players, push]);
};

export default useOnGameEnd;
