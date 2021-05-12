import { GameEnd, OnlineGameId, PlayerId } from 'containers/Game/types';
import { GameEndCondition, PlayerCondition } from 'enums';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { BASE_PATH } from 'routes/constants';
import { ReactRouterState } from 'routes/types';
import useOnlineGameActions from 'store/firebase/hooks/useOnlineGameActions';

const useOnGameEnd = (
	players: GameEnd['players'],
	currentOnlinePlayerId?: PlayerId,
	gameId?: OnlineGameId
) => {
	const { push } = useHistory<ReactRouterState>();
	const { removeOnlineGame } = useOnlineGameActions();

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

		push(`${BASE_PATH}/game-end`, {
			endGame: {
				players,
				currentOnlinePlayerId,
				gameEndCondition,
			},
		});

		if (gameId) {
			// delay the game deletion as the death event is recreating the
			// object in firebase
			setTimeout(() => {
				removeOnlineGame(gameId);
			}, 1000);
		}
	}, [
		currentOnlinePlayerId,
		gameEndCondition,
		gameId,
		players,
		push,
		removeOnlineGame,
	]);
};

export default useOnGameEnd;
