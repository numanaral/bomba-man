import {
	isEmpty,
	isLoaded,
	useFirebase,
	useFirebaseConnect,
} from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import useAuth from 'store/firebase/hooks/useAuth';
import { toFirestore } from 'store/firebase/utils';
import { makeSelectOnlineGame } from 'store/redux/reducers/firebase/selectors';
import { GameState } from 'store/redux/reducers/game/types';
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
	const { userId } = useAuth();
	const firebase = useFirebase();
	const refKey = `online/${id}`;
	useFirebaseConnect(refKey);
	const { create, update, remove } = useFirebaseUtils<OnlineGame>(refKey);

	const onlineGameFromFirebase = useSelector(makeSelectOnlineGame(id));

	const pending = !isLoaded(onlineGameFromFirebase) && <LoadingIndicator />;
	const error = isEmpty(onlineGameFromFirebase) && (
		<NoAccess>
			<LazyJoin noWrapper />
		</NoAccess>
	);

	const game = onlineGameFromFirebase;

	const createOnlineGame = async (props: GameState, gameId: string = id) => {
		try {
			await firebase.set(
				`online/${gameId}`,
				toFirestore({
					...props,
					userId,
					// extra props
				})
			);
		} catch (err) {
			// notifyError(err);
		}
	};

	const updateOnlineGame = async (props: Partial<GameState>) => {
		try {
			await firebase.update(`online/${id}`, toFirestore(props));
		} catch (err) {
			// notifyError(err);
		}
	};

	const deleteOnlineGame = async () => {
		try {
			await firebase.remove(`online/${id}`);
		} catch (err) {
			// notifyError(err);
		}
	};

	const onPlayerJoin = (playerId: PlayerId) => {
		// set player as active
		update<OnlineGame['players']>(
			{
				[playerId]: PlayerCondition.Alive,
			},
			'/players'
		);

		const playerConfig = generatePlayer(
			playerId,
			game.gameState.config,
			gameConfig.keyboardConfig
		);

		// put him in the game state
		create<PlayerConfig>(playerConfig, `/gameState/players/${playerId}`);
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
		remove(`/players/${playerId}`);
		// remove him from the game state
		remove(`/gameState/players/${playerId}`);

		// 2 because the state won't be updated just yet
		if (Object.keys(game.players).length <= 2) {
			onEndGame();
		}
	};

	const onPlayerDeath = (playerId: PlayerId) => {
		update<OnlineGame['players']>(
			{
				[playerId]: PlayerCondition.Dead,
			},
			'/players'
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
			config: defaultGameState.config,
		},
		players: game?.players || {},
		started: game?.started || false,
	};

	return {
		game: _game,
		createOnlineGame,
		updateOnlineGame,
		deleteOnlineGame,
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
