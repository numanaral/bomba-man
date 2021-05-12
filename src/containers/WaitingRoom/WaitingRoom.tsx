import { OnlineGameId, PlayerId } from 'containers/Game/types';
import useBeforeUnload from 'hooks/useBeforeUnload';
import { useEffect, useState } from 'react';
import useWatchOnlineGame from 'store/firebase/hooks/useWatchOnlineGame';
import { useHistory } from 'react-router-dom';
import { BASE_PATH } from 'routes/constants';
import { CharacterIcon } from 'containers/RoomCreator/icons';
import { Grid } from '@material-ui/core';
import ContainerWithCenteredItems from 'components/ContainerWithCenteredItems';
import Spacer from 'components/Spacer';
import TooltipButton from 'components/TooltipButton';

interface Props {
	// playerId: PlayerId;
	gameId: OnlineGameId;
}

// TODO
const WaitingRoom = ({ gameId }: Props) => {
	const { push, listen } = useHistory();

	const {
		pending,
		error,
		game,
		isReady,
		onPlayerJoin,
		onPlayerExit,
		onStartGame,
	} = useWatchOnlineGame(gameId);

	const [playerId, setPlayerId] = useState<PlayerId>();

	useBeforeUnload(() => {
		if (!playerId) return;
		onPlayerExit(playerId);
	});

	const unlisten = listen(({ pathname }) => {
		if (!playerId) return;
		// if we are redirected to the game, don't trigger this
		if (pathname === `${BASE_PATH}/online/${gameId}`) return;
		onPlayerExit(playerId);
	});

	useEffect(() => {
		return () => unlisten();
	}, [unlisten]);

	useEffect(() => {
		if (!isReady) return;

		const { players } = game;
		const playerKeys = Object.keys(players);
		const playerCount = playerKeys.length;
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
		setPlayerId(newPlayerId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isReady]);

	useEffect(() => {
		if (!isReady) return;
		if (!game?.started) return;

		push(`${BASE_PATH}/online/${gameId}`, { playerId });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isReady, game?.started]);

	return (
		pending ||
		error || (
			<ContainerWithCenteredItems container>
				<Spacer spacing="5" />
				<ContainerWithCenteredItems container>
					<Grid container justify="center" item xs={12} sm={4}>
						<TooltipButton
							text="Start"
							fullWidth
							bg="primary"
							variant="contained"
							disabled={Object.keys(game.players).length <= 1}
							onClick={onStartGame}
						/>
					</Grid>
				</ContainerWithCenteredItems>
				<Spacer spacing="15" />
				<Grid container justify="space-between" item xs={12} sm={8}>
					{Object.keys(game.players).map(id => {
						const isCurrentPlayer = playerId === id;
						return (
							<CharacterIcon
								size={isCurrentPlayer ? 80 : 50}
								name={id}
								id={id as PlayerId}
								showId
								isWalking={isCurrentPlayer}
							/>
						);
					})}
				</Grid>
			</ContainerWithCenteredItems>
		)
	);
};

export default WaitingRoom;
