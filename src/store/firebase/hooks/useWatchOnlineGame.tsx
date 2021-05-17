import { isEmpty, isLoaded, useFirebaseConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { makeSelectOnlineGame } from 'store/redux/reducers/firebase/selectors';
import { generatePlayer } from 'utils/game';
import LoadingIndicator from 'components/LoadingIndicator';
import NoAccess from 'components/NoAccess';
import loadable from 'utils/loadable';
import { OnlineGame, PlayerConfig, PlayerId } from 'containers/Game/types';
import gameConfig from 'config';
import { PlayerCondition } from 'enums';
import useFirebaseUtils from './useFirebaseUtils';
import useOnlineGameActions from './useOnlineGameActions';
// TODO: notification-provider
// import useNotificationProvider from 'store/redux/hooks/useNotificationProvider';

const LazyJoin = loadable(() => import(`routes/pages/Join`));

// const defaultGameState = generateDefaultGameState();

const useWatchOnlineGame = (id: string) => {
	// const { notifyError } = useNotificationProvider();
	const refKey = `online/${id}`;
	useFirebaseConnect(refKey);
	const { update, remove } = useFirebaseUtils<OnlineGame>(refKey);
	const { removeOnlineGame } = useOnlineGameActions();

	const game = useSelector(makeSelectOnlineGame(id));

	const pending = !isLoaded(game) && <LoadingIndicator />;
	// check for gameState being not defined, otherwise it doesn't return error
	const error = isEmpty(game, game?.gameState) && (
		<NoAccess>
			<LazyJoin noWrapper />
		</NoAccess>
	);

	const onPlayerJoin = (playerId: PlayerId, isNPC = false) => {
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
			(!isNPC && gameConfig.keyboardConfig) || null
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
			gamePlayers: {},
		});
	};

	const onPlayerExit = (playerId: PlayerId) => {
		// remove as active player
		remove(`/gamePlayers/${playerId}`);
		// remove him from the game state
		remove(`/gameState/players/${playerId}`);

		if (game?.gamePlayers) {
			const playerLength = Object.keys(game.gamePlayers).length;
			// 1 <= because the state won't be updated just yet
			if (playerLength <= 1) {
				removeOnlineGame(id);
				// 2 <= because the state won't be updated just yet
				// ??!!: Is this necessary? Change this when restart is added
			} else if (playerLength <= 2) {
				onEndGame();
			}
		}
	};

	const onPlayerDeath = (playerId: PlayerId) => {
		if (!id) return;
		update<OnlineGame['gamePlayers']>(
			{
				[playerId]: PlayerCondition.Dead,
			},
			'/gamePlayers'
		);
	};

	return {
		game: {
			...game,
			gameState: {
				...(game?.gameState || {}),
				players: game?.gameState?.players || {},
				bombs: game?.gameState?.bombs || {},
				powerUps: game?.gameState?.powerUps || {},
			},
			gamePlayers: game?.gamePlayers || {},
			gameId: game?.gameId || id,
			started: game?.started || false,
		},
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
