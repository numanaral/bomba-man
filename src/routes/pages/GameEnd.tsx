import PageContainer from 'components/PageContainer';
import { RouteComponentPropsWithLocationState } from 'routes/types';
import { H1 } from 'components/typography';
import theme from 'theme';
import { useHistory } from 'react-router-dom';
import { BASE_PATH } from 'routes/constants';
import { useEffect } from 'react';
import { GameEndCondition, GameType } from 'enums';
import PlayerDisplay from 'containers/WaitingRoom/PlayerDisplay';
import useCreateRoomAndRedirect from 'containers/RoomCreator/useCreateRoomAndRedirect';
import useWatchOnlineGame from 'store/firebase/hooks/useWatchOnlineGame';
import useOnlineGameActions from 'store/firebase/hooks/useOnlineGameActions';
import { generateDefaultGameState } from 'utils/game';
import useOnPlayerExitOnline from 'hooks/useOnPlayerExitOnline';
import LoadingIndicator from 'components/LoadingIndicator';
import { GameConfig } from 'store/redux/reducers/game/types';
import { OnlineGameId, PlayerId } from 'containers/Game/types';

interface Props extends RouteComponentPropsWithLocationState<{ id?: string }> {}

type WrappedChild = {
	children: ({
		onRestartGame,
	}: {
		onRestartGame: CallableFunction;
	}) => React.ReactElement;
};

type LocalGameEndProps = {
	gameConfig?: GameConfig;
} & WrappedChild;

type OnlineGameEndProps = {
	gameConfig?: GameConfig;
	gameId: OnlineGameId;
	currentOnlinePlayerId?: PlayerId;
} & WrappedChild;

const LocalGameEnd = ({ children, gameConfig }: LocalGameEndProps) => {
	const onCreate = useCreateRoomAndRedirect(GameType.Local);

	const onRestartGame = async () => {
		onCreate(gameConfig);
	};

	return children({ onRestartGame });
};

const OnlineGameEnd = ({
	children,
	gameConfig,
	gameId,
	currentOnlinePlayerId,
}: OnlineGameEndProps) => {
	const { push } = useHistory();
	const { game, isReady } = useWatchOnlineGame(gameId);
	const { restartOnlineGame } = useOnlineGameActions();
	useOnPlayerExitOnline(gameId, currentOnlinePlayerId);

	// we will listen to the change on the started value to trigger a restart
	// when the game ends, the started will be true, but then on restart, we
	// will set this to false, thus triggering the following effect
	const gameHasEnded = game.started;

	useEffect(() => {
		if (!isReady) return;
		if (gameHasEnded) return;

		// each player will wait half as long as their id #s
		// sill as is, this is required because onPlayerJoin cannot handle
		// multi connections that happen at the exact time, this would not
		// be a problem with socket.io but not sure how I can handle this
		// in firebase, thus this workaround
		const waitTimeBeforeRedirect =
			(Number(currentOnlinePlayerId?.replace('P', '')) - 1) * 750;

		// TODO: Popup that says redirecting
		setTimeout(() => {
			push(`${BASE_PATH}/waiting-room/${gameId}`, {
				playerId: currentOnlinePlayerId,
			});
		}, waitTimeBeforeRedirect);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gameHasEnded, isReady]);

	const onRestartGame = async () => {
		restartOnlineGame(gameId, generateDefaultGameState(gameConfig));
	};

	if (!gameHasEnded) return <LoadingIndicator />;
	return children({ onRestartGame });
};

const GameEnd = ({ location, match }: Props) => {
	const { push } = useHistory();
	const endGame = location?.state?.endGame;
	const gameConfig = location?.state?.gameConfig;
	const gameId = match?.params?.id || '';

	const currentOnlinePlayerId = endGame?.currentOnlinePlayerId;
	const gameType = gameId ? GameType.Online : GameType.Local;

	// This room requires a message, otherwise redirect to home
	useEffect(() => {
		if (!endGame) push(`${BASE_PATH}/`);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!endGame) return null;

	const { gameEndCondition, ...playerDisplayProps } = endGame!;

	const isWon = gameEndCondition === GameEndCondition.Win;
	const emoji = isWon ? ':)' : ':(';

	const isLocalGame = gameType === GameType.Local;

	const endColorVariant = isWon
		? 'success'
		: ('error' as KeysOf<typeof theme.palette.color>);

	const body: WrappedChild['children'] = ({ onRestartGame }) => {
		return (
			<PageContainer style={{ overflow: 'hidden' }}>
				<H1>
					You have{' '}
					<span
						style={{
							color: theme.palette.color[endColorVariant],
						}}
					>
						{gameEndCondition}
					</span>{' '}
					the game {emoji}
				</H1>
				<PlayerDisplay
					{...playerDisplayProps}
					isGameEnd
					canStart
					onStartGame={onRestartGame}
					currentOnlinePlayerId={
						// local game will always have P1 as the main player
						// this way the restart button will always be available
						isLocalGame ? 'P1' : currentOnlinePlayerId
					}
				/>
			</PageContainer>
		);
	};

	return isLocalGame ? (
		<LocalGameEnd gameConfig={gameConfig}>{body}</LocalGameEnd>
	) : (
		<OnlineGameEnd
			gameConfig={gameConfig}
			gameId={gameId}
			currentOnlinePlayerId={currentOnlinePlayerId}
		>
			{body}
		</OnlineGameEnd>
	);
};

export default GameEnd;
