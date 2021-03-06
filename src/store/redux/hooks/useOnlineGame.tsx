import { GameApiHookOnline, OnlineGameId } from 'containers/Game/types';
import { GameType } from 'enums';
import useOnlineGameProvider from 'store/firebase/hooks/useOnlineGameProvider';
import useWatchOnlineGame from 'store/firebase/hooks/useWatchOnlineGame';

const useOnlineGame: GameApiHookOnline = gameId => {
	const { pending, error, game } = useWatchOnlineGame(gameId as string);

	const provider = useOnlineGameProvider(
		gameId as OnlineGameId,
		game?.gameState
	);

	return {
		provider,
		pending,
		error,
		state: game?.gameState,
		type: GameType.Online,
		gamePlayers: game?.gamePlayers,
	};
};

export default useOnlineGame;
