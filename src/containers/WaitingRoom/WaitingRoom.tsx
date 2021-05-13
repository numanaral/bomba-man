import { OnlineGameId, PlayerId } from 'containers/Game/types';
import { useEffect, useRef, useState } from 'react';
import useWatchOnlineGame from 'store/firebase/hooks/useWatchOnlineGame';
import { useHistory } from 'react-router-dom';
import { BASE_PATH } from 'routes/constants';
import useOnPlayerExitOnline from 'hooks/useOnPlayerExitOnline';
import theme from 'theme';
import Spacer from 'components/Spacer';
import { H1, H4 } from 'components/typography';
// import { mapPlayersToGamePlayers } from 'utils/game';
import PlayerDisplay from './PlayerDisplay';

interface Props {
	// playerId: PlayerId;
	gameId: OnlineGameId;
}

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

	const npcPlayerIds = useRef<Array<PlayerId>>([]);

	// // setup the NPCs
	// useEffect(() => {
	// 	if (!isReady) return;

	// 	const {
	// 		gameState: {
	// 			players,
	// 			config: { powerUps: powerUpConfig },
	// 		},
	// 	} = game;
	// 	const mappedPlayers = mapPlayersToGamePlayers(players, powerUpConfig);
	// 	Object.keys(mappedPlayers).forEach(playerId => {
	// 		onPlayerJoin(playerId as PlayerId, true);
	// 		npcPlayerIds.current.push(playerId as PlayerId);
	// 	});
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	const [canStart, setCanStart] = useState(false);

	const [
		currentOnlinePlayerId,
		setCurrentOnlinePlayerId,
	] = useState<PlayerId>();

	useOnPlayerExitOnline(gameId, currentOnlinePlayerId);

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

	useEffect(() => {
		if (!isReady) return;

		const { gamePlayers } = game;
		const playerCount = Object.keys(gamePlayers).length;

		// we don't want to count the NPCs, there should be
		// at least 2 Human Players
		if (playerCount - npcPlayerIds.current.length > 1) {
			setCanStart(true);
		}
	}, [game, isReady]);

	const {
		location: { origin, pathname },
	} = window;
	const link = origin + pathname;

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
					canStart={canStart}
					currentOnlinePlayerId={currentOnlinePlayerId}
				/>
			</>
		)
	);
};

export default WaitingRoom;
