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

	const {
		players,
		config: {
			powerUps: powerUpConfig,
			duration: {
				bomb: { exploding },
			},
		},
	} = gameState;
	let gameEndCondition = GameEndCondition.Lose;

	const mappedPlayers = mapPlayersToGamePlayers(players, powerUpConfig);

	const { P1, P2 } = mappedPlayers;
	// P1 or P2 alive will display You have won as both players are on the same screen
	if (P1 === PlayerCondition.Alive || (P2 && P2 === PlayerCondition.Alive)) {
		gameEndCondition = GameEndCondition.Win;
	}

	useEffect(() => {
		const alivePlayers = Object.values(mappedPlayers).filter(
			playerCondition => playerCondition === PlayerCondition.Alive
		);

		if (alivePlayers.length > 1) return;

		setTimeout(() => {
			onGameEnd();
			push(`${BASE_PATH}/game-end`, {
				endGame: {
					players: mappedPlayers,
					currentOnlinePlayerId: Object.keys(
						alivePlayers
					)[0] as PlayerId,
					gameEndCondition,
				},
			});
		}, exploding * 1000 + 1000);
	}, [exploding, gameEndCondition, mappedPlayers, onGameEnd, push]);
};

export default useOnGameEndLocal;
