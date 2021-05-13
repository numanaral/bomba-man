import { OnlineGameId, PlayerId } from 'containers/Game/types';
import { useEffect, useState } from 'react';
import useWatchOnlineGame from 'store/firebase/hooks/useWatchOnlineGame';
import { useHistory } from 'react-router-dom';
import { BASE_PATH } from 'routes/constants';
import useOnPlayerExit from 'hooks/useOnPlayerExit';
import theme from 'theme';
import Spacer from 'components/Spacer';
import { H1, H4 } from 'components/typography';
import PlayerDisplay from './PlayerDisplay';

interface Props {
	// playerId: PlayerId;
	gameId: OnlineGameId;
}

// TODO
const WaitingRoom = ({ gameId }: Props) => {
	const { push } = useHistory();

	const {
		pending,
		error,
		game,
		isReady,
		onPlayerJoin,
		onStartGame,
	} = useWatchOnlineGame(gameId);

	const [
		currentOnlinePlayerId,
		setCurrentOnlinePlayerId,
	] = useState<PlayerId>();

	useOnPlayerExit(gameId, currentOnlinePlayerId);

	useEffect(() => {
		if (!isReady) return;

		const { gamePlayers } = game;
		const playerKeys = Object.keys(gamePlayers);
		const playerCount = playerKeys.length;

		if (game.started) {
			push(`${BASE_PATH}/unauthorized`, {
				message: 'Game has already started!',
			});
			return;
		}

		if (playerCount > 3) {
			push(`${BASE_PATH}/unauthorized`, { message: 'Game is full!' });
			return;
		}
		// Pick a number that's the smallest from non existing player ids
		// i.e. P1 joins, P2 joins, P1 leaves, P1 joins, he should be assigned
		// P1 and not P2 (because ind + 1 will be 2 at this point)
		const currentPlayerNumbers = playerKeys.map(key => {
			return Number(key.replace('P', ''));
		});
		const openPlayerNumbers = [1, 2, 3, 4].filter(openNumber => {
			return !currentPlayerNumbers.includes(openNumber);
		});
		const newPlayerId = `P${Math.min(...openPlayerNumbers)}` as PlayerId;
		onPlayerJoin(newPlayerId);
		// TODO: error checking?
		setCurrentOnlinePlayerId(newPlayerId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isReady]);

	useEffect(() => {
		if (!isReady) return;
		if (!game?.started) return;

		push(`${BASE_PATH}/online/${gameId}`, {
			playerId: currentOnlinePlayerId,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isReady, game?.started]);

	const {
		location: { origin, pathname },
	} = window;
	const link = origin + pathname;
	debugger;
	console.log(game.gamePlayers);

	return (
		pending ||
		error || (
			<>
				<H1> Waiting Room </H1>
				<Spacer />
				<H4>
					Room / Game Id:
					<br />
					<span style={{ color: theme.palette.color.info }}>
						{gameId}
					</span>
				</H4>
				<Spacer />
				<H4>
					Join Link:
					<br />
					<span style={{ color: theme.palette.color.info }}>
						{link}
					</span>
				</H4>
				<PlayerDisplay
					players={game.gamePlayers}
					onStartGame={onStartGame}
					currentOnlinePlayerId={currentOnlinePlayerId}
				/>
			</>
		)
	);
};

export default WaitingRoom;
