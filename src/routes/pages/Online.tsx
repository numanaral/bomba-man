import Game from 'containers/Game';
import { RouteComponentPropsWithLocationState } from 'routes/types';
import useOnlineGame from 'store/redux/hooks/useOnlineGame';

const Online = ({
	match: {
		params: { id },
	},
}: RouteComponentPropsWithLocationState<{ id: string }>) => {
	const { pending, error, ...gameProps } = useOnlineGame(id);
	return pending || error || <Game {...gameProps} />;
};

export default Online;
