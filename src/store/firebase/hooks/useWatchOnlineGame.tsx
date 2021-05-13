import { isEmpty, isLoaded, useFirebaseConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { makeSelectOnlineGame } from 'store/redux/reducers/firebase/selectors';
import { generateDefaultGameState, generatePlayer } from 'utils/game';
import LoadingIndicator from 'components/LoadingIndicator';
import NoAccess from 'components/NoAccess';
import loadable from 'utils/loadable';
import { OnlineGame, PlayerConfig, PlayerId } from 'containers/Game/types';
import gameConfig from 'config';
import { PlayerCondition } from 'enums';
import useFirebaseUtils from './useFirebaseUtils';
// TODO: notification-provider
// import useNotificationProvider from 'store/redux/hooks/useNotificationProvider';

const LazyJoin = loadable(() => import(`routes/pages/Join`));

const defaultGameState = generateDefaultGameState();

const useWatchOnlineGame = (id: string) => {
	// const { notifyError } = useNotificationProvider();
	const refKey = `online/${id}`;
	useFirebaseConnect(refKey);
	const { update, remove } = useFirebaseUtils<OnlineGame>(refKey);

	const onlineGameFromFirebase = useSelector(makeSelectOnlineGame(id));

	const pending = !isLoaded(onlineGameFromFirebase) && <LoadingIndicator />;
	const error = isEmpty(onlineGameFromFirebase) && (
		<NoAccess>
			<LazyJoin noWrapper />
		</NoAccess>
	);

	const game = onlineGameFromFirebase;

	const onPlayerJoin = (playerId: PlayerId) => {
		// set player as active
		update<OnlineGame['gamePlayers']>(
			{
				[playerId]: PlayerCondition.Alive,
			},
			'/gamePlayers'
		);

		const playerConfig = generatePlayer(
			playerId,
			game.gameState.config,
			gameConfig.keyboardConfig
		);

		// put him in the game state
		update<PlayerConfig>(playerConfig, `/gameState/players/${playerId}`);
	};

	const onStartGame = () => {
		update({
			started: true,
		});
	};

	const onEndGame = () => {
		update({
			started: false,
		});
	};

	const onPlayerExit = (playerId: PlayerId) => {
		// remove as active player
		remove(`/gamePlayers/${playerId}`);
		// remove him from the game state
		remove(`/gameState/players/${playerId}`);

		// 2 because the state won't be updated just yet
		if (game.gamePlayers && Object.keys(game.gamePlayers).length <= 2) {
			onEndGame();
		}
	};

	const onPlayerDeath = (playerId: PlayerId) => {
		update<OnlineGame['gamePlayers']>(
			{
				[playerId]: PlayerCondition.Dead,
			},
			'/gamePlayers'
		);
	};

	const _game: OnlineGame = {
		gameId: id,
		gameState: {
			players: game?.gameState?.players || defaultGameState.players,
			gameMap: game?.gameState?.gameMap || defaultGameState.gameMap,
			bombs: game?.gameState?.bombs || defaultGameState.bombs,
			powerUps: game?.gameState?.powerUps || defaultGameState.powerUps,
			is3D: game?.gameState?.is3D || defaultGameState.is3D,
			isSideView:
				game?.gameState?.isSideView || defaultGameState.isSideView,
			animationCounter:
				game?.gameState?.animationCounter ||
				defaultGameState.animationCounter,
			config: game?.gameState?.config || defaultGameState.config,
		},
		gamePlayers: game?.gamePlayers || {},
		started: game?.started || false,
	};

	return {
		game: _game,
		pending,
		error,
		isReady: !pending && !error,
		onPlayerJoin,
		onPlayerExit,
		onStartGame,
		onPlayerDeath,
	};
};

export default useWatchOnlineGame;
