import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { OnlineGameId, PlayerId } from 'containers/Game/types';
import { BASE_PATH } from 'routes/constants';
import useWatchOnlineGame from 'store/firebase/hooks/useWatchOnlineGame';
import useBeforeUnload from './useBeforeUnload';

const useOnPlayerExit = (gameId: OnlineGameId, playerId?: PlayerId) => {
	const { onPlayerExit } = useWatchOnlineGame(gameId);
	const { listen } = useHistory();
	useBeforeUnload(() => {
		if (!playerId) return;
		onPlayerExit(playerId);
	});

	useEffect(() => {
		return listen(({ pathname }) => {
			if (!playerId) return;
			// if we are redirected to the game, don't trigger this
			if (pathname === `${BASE_PATH}/online/${gameId}`) return;
			// end game screen should not trigger this either
			if (pathname === `${BASE_PATH}/game-end`) return;
			onPlayerExit(playerId);
		});
	}, [gameId, listen, onPlayerExit, playerId]);
};

export default useOnPlayerExit;
