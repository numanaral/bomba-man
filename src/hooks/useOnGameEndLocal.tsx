import { PlayerId } from 'containers/Game/types';
import { GameEndCondition, PlayerCondition } from 'enums';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { BASE_PATH } from 'routes/constants';
import { ReactRouterState } from 'routes/types';
import { GameState } from 'store/redux/reducers/game/types';
import { mapPlayersToGamePlayers } from 'utils/game';

const useOnGameEndLocal = (
	gameState: GameState,
	onGameEnd: CallableFunction
) => {
	const { push } = useHistory<ReactRouterState>();

	const players = gameState?.players;
	const powerUpConfig = gameState?.config?.powerUps;
	const explodingDuration = gameState?.config?.duration.bomb.exploding;
	let gameEndCondition = GameEndCondition.Lose;

	const mappedPlayers = mapPlayersToGamePlayers(players, powerUpConfig);

	const { P1, P2 } = mappedPlayers;
	// P1 or P2 alive will display You have won as both players are on the same screen
	if (
		P1 === PlayerCondition.Alive ||
		// P2 is a Human Player
		(P2 && !players.P2?.isNPC && P2 === PlayerCondition.Alive)
	) {
		gameEndCondition = GameEndCondition.Win;
	}

	useEffect(() => {
		const alivePlayers = Object.entries(mappedPlayers)
			.filter(
				([_, playerCondition]) =>
					playerCondition === PlayerCondition.Alive
			)
			.map(([playerId]) => playerId);

		if (alivePlayers.length > 1) return;

		setTimeout(() => {
			onGameEnd();
			// ensure that the redux state was updated
			setTimeout(() => {
				push(`${BASE_PATH}/game-end`, {
					endGame: {
						players: mappedPlayers,
						currentOnlinePlayerId: alivePlayers[0] as PlayerId,
						gameEndCondition,
					},
					gameConfig: gameState.config,
				});
			}, 0);
		}, (explodingDuration || 1) * 1000 + 1000);
	}, [
		mappedPlayers,
		explodingDuration,
		gameEndCondition,
		gameState.config,
		onGameEnd,
		push,
	]);
};

export default useOnGameEndLocal;
