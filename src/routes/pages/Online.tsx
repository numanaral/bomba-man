import Game from 'containers/Game';
import useBeforeUnload from 'hooks/useBeforeUnload';
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
	const { onPlayerExit } = useWatchOnlineGame(id);
	const playerId = location?.state?.playerId;

	useBeforeUnload(() => {
		if (!playerId) return;
		onPlayerExit(playerId);
	});

	return pending || error || <Game {...gameProps} playerId={playerId} />;
};

export default Online;
