import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { OnlineGameId, PlayerId } from 'containers/Game/types';
import { BASE_PATH } from 'routes/constants';
import useWatchOnlineGame from 'store/firebase/hooks/useWatchOnlineGame';
import useBeforeUnload from './useBeforeUnload';

const WHITELISTED_PAGES = ['online', 'waiting-room', 'game-end'];
const useOnPlayerExitOnline = (gameId: OnlineGameId, playerId?: PlayerId) => {
	const { onPlayerExit } = useWatchOnlineGame(gameId);
	const { listen } = useHistory();
	useBeforeUnload(() => {
		if (!playerId) return;
		if (!gameId) return;
		onPlayerExit(playerId);
	});

	/** @see https://help.mouseflow.com/en/articles/4310818-tracking-url-changes-with-react#:~:text=2.%20Listening%20for%20route%20changes */
	useEffect(() => {
		return listen(({ pathname }) => {
			if (!playerId) return;
			// if on a whitelisted page, that doesn't count as exit
			const isWhitelistedPage = WHITELISTED_PAGES.some(page => {
				return pathname.startsWith(`${BASE_PATH}/${page}/${gameId}`);
			});
			if (isWhitelistedPage) return;
			onPlayerExit(playerId);
		});
	}, [gameId, listen, onPlayerExit, playerId]);
};

export default useOnPlayerExitOnline;
