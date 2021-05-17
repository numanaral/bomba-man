import { GamePlayers } from 'containers/Game/types';
import { useState, useEffect } from 'react';

/**
 * Condition to allow to start a game, there has to be at least two players.
 *
 * @param game The Game API.
 * @param isReady Used for online game to ensure firebase has fetched the game.
 *
 * @returns Can the game start?
 */
const useCanStartGame = (gamePlayers: GamePlayers, isReady = true) => {
	// const npcPlayerIds = useRef<Array<PlayerId>>([]);

	// // setup the NPCs
	// useEffect(() => {
	// 	if (!isReady) return;

	// 	const {
	// 		gameState: {
	// 			players,
	// 			config: { powerUps: powerUpConfig },
	// 		},
	// 	} = game;
	// 	const mappedPlayers = mapPlayersToGamePlayers(players, powerUpConfig);
	// 	Object.keys(mappedPlayers).forEach(playerId => {
	// 		onPlayerJoin(playerId as PlayerId, true);
	// 		npcPlayerIds.current.push(playerId as PlayerId);
	// 	});
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	const [canStart, setCanStart] = useState(false);

	useEffect(() => {
		if (!isReady) return;

		const playerCount = Object.keys(gamePlayers).length;

		// we don't want to count the NPCs, there should be
		// at least 2 Human Players
		// if (playerCount - npcPlayerIds.current.length > 1) {
		if (playerCount > 1) {
			setCanStart(true);
		}
	}, [gamePlayers, isReady]);

	return canStart;
};

export default useCanStartGame;
