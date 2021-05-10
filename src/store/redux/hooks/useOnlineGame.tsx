import { GameApiHookOnline } from 'containers/Game/types';
import useOnlineGameProvider from 'store/firebase/hooks/useOnlineGameProvider';
import useWatchOnlineGame from 'store/firebase/hooks/useWatchOnlineGame';

const useOnlineGame: GameApiHookOnline = gameId => {
	const { pending, error, gameState: state } = useWatchOnlineGame(
		gameId as string
	);
	const provider = useOnlineGameProvider(gameId as string, state);

	return {
		provider,
		pending,
		error,
		state,
	};
};

export default useOnlineGame;
