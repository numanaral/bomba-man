import LoadingIndicator from 'components/LoadingIndicator';
import Game from 'containers/Game';
import { GameApi } from 'containers/Game/types';
import useOnGameEndLocal from 'hooks/useOnGameEndLocal';
import { RouteComponentPropsWithLocationState } from 'routes/types';
import useLocalGame from 'store/redux/hooks/useLocalGame';

// need to wrap it as game props will be null if the user goes to
// /local without going through /room-creator
const Wrapper = ({ gameProps }: { gameProps: GameApi }) => {
	// bug: old game state is passed, since the players are
	// already dead, ends the game. This will be fixed once
	// the redux store is injected rather then set on default
	// temporary workaround: start the game again to clear
	// I could create a revivePlayer function but not now..
	useOnGameEndLocal(gameProps.state, gameProps.provider.startGame);

	return <Game {...gameProps} />;
};

const Local = ({ location }: RouteComponentPropsWithLocationState) => {
	const gameConfig = location?.state?.gameConfig;
	const gameProps = useLocalGame(gameConfig);
	const gameState = gameProps?.state || {};
	const hasState = Object.values(gameState).length;

	if (!hasState) gameProps?.provider.startGame(gameConfig);

	return gameProps && hasState ? (
		<Wrapper gameProps={gameProps} />
	) : (
		<LoadingIndicator />
	);
};

export default Local;
