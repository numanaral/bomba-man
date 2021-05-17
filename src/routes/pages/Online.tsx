import Game from 'containers/Game';
import { OnlineGameId, PlayerId } from 'containers/Game/types';
import useOnGameEnd from 'hooks/useOnGameEnd';
import useOnPlayerExitOnline from 'hooks/useOnPlayerExitOnline';
import { RouteComponentPropsWithLocationState } from 'routes/types';
import useOnlineGame from 'store/redux/hooks/useOnlineGame';

type WrapperProps = {
	gameId: OnlineGameId;
	currentOnlinePlayerId?: PlayerId;
	gameProps: Omit<ReturnType<typeof useOnlineGame>, 'pending' | 'error'>;
};

const Wrapper = ({
	gameId,
	currentOnlinePlayerId,
	gameProps,
}: WrapperProps) => {
	useOnPlayerExitOnline(gameId, currentOnlinePlayerId);
	useOnGameEnd(
		gameProps.gamePlayers,
		currentOnlinePlayerId,
		gameId,
		gameProps.state.config
	);

	return (
		<Game {...gameProps} playerId={currentOnlinePlayerId} gameId={gameId} />
	);
};

const Online = ({
	location,
	match: {
		params: { id: gameId },
	},
}: RouteComponentPropsWithLocationState<{ id: string }>) => {
	const { pending, error, ...gameProps } = useOnlineGame(gameId);
	const currentOnlinePlayerId = location?.state?.playerId;

	return (
		pending ||
		error || (
			<Wrapper
				gameId={gameId}
				currentOnlinePlayerId={currentOnlinePlayerId}
				gameProps={gameProps}
			/>
		)
	);
};

export default Online;
