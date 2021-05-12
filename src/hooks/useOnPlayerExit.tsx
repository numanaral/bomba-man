import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { OnlineGameId, PlayerId } from 'containers/Game/types';
import { BASE_PATH } from 'routes/constants';
import useBeforeUnload from './useBeforeUnload';

const useOnPlayerExit = (
	gameId: OnlineGameId,
	onPlayerExit: (playerId: PlayerId) => void,
	playerId?: PlayerId
) => {
	const { listen } = useHistory();
	useBeforeUnload(() => {
		if (!playerId) return;
		onPlayerExit(playerId);
	});

	const unlisten = listen(({ pathname }) => {
		if (!playerId) return;
		// if we are redirected to the game, don't trigger this
		if (pathname === `${BASE_PATH}/online/${gameId}`) return;
		onPlayerExit(playerId);
	});

	useEffect(() => {
		return () => unlisten();
	}, [unlisten]);
};

export default useOnPlayerExit;
