import LoadingIndicator from 'components/LoadingIndicator';
import Game from 'containers/Game';
import { RouteComponentPropsWithLocationState } from 'routes/types';
import useLocalGame from 'store/redux/hooks/useLocalGame';

const Local = ({ location }: RouteComponentPropsWithLocationState) => {
	const gameConfig = location?.state?.gameConfig;
	const gameProps = useLocalGame(gameConfig);

	return gameProps ? <Game {...gameProps} /> : <LoadingIndicator />;
};

export default Local;
