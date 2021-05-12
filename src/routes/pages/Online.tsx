import Game from 'containers/Game';
import useOnGameEnd from 'hooks/useOnGameEnd';
import useOnPlayerExit from 'hooks/useOnPlayerExit';
import { RouteComponentPropsWithLocationState } from 'routes/types';
import useWatchOnlineGame from 'store/firebase/hooks/useWatchOnlineGame';
import useOnlineGame from 'store/redux/hooks/useOnlineGame';

const Online = ({
	location,
	match: {
		params: { id },
	},
}: RouteComponentPropsWithLocationState<{ id: string }>) => {
	const { pending, error, ...gameProps } = useOnlineGame(id);
	const { onPlayerExit, game } = useWatchOnlineGame(id);
	const currentOnlinePlayerId = location?.state?.playerId;
	const players = game?.players || {};

	useOnPlayerExit(id, onPlayerExit, currentOnlinePlayerId);
	useOnGameEnd(players, currentOnlinePlayerId);

	return (
		pending ||
		error || <Game {...gameProps} playerId={currentOnlinePlayerId} />
	);
};

export default Online;
