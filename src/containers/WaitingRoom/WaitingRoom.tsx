import {
	OnlineGameId,
	PlayerId,
	FontAwesomeIconProps,
} from 'containers/Game/types';
import { useEffect, useState } from 'react';
import useWatchOnlineGame from 'store/firebase/hooks/useWatchOnlineGame';
import { useHistory } from 'react-router-dom';
import { BASE_PATH } from 'routes/constants';
import useOnPlayerExitOnline from 'hooks/useOnPlayerExitOnline';
import theme from 'theme';
import Spacer from 'components/Spacer';
import { H1, H4 } from 'components/typography';
import useCanStartGame from 'hooks/useCanStartGame';
import TooltipButton from 'components/TooltipButton';
import copyToClipboard from 'utils/copy-to-clipboard';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageContainer from 'components/PageContainer';
import PlayerDisplay from './PlayerDisplay';

const CopyIcon = (props: FontAwesomeIconProps) => (
	<FontAwesomeIcon icon={faCopy} {...props} />
);

interface Props {
	gameId: OnlineGameId;
}

type UseWatchOnlineGameProps = ReturnType<typeof useWatchOnlineGame>;
type UseOnJoinRoom = Pick<UseWatchOnlineGameProps, 'game' | 'onPlayerJoin'>;
type UseOnGameStart = Pick<UseWatchOnlineGameProps, 'game'> & {
	gameId: OnlineGameId;
	playerId?: PlayerId;
};

/** Handles players joining into the room */
const useOnJoinRoom = ({ game, onPlayerJoin }: UseOnJoinRoom) => {
	const { push } = useHistory();

	const [
		currentOnlinePlayerId,
		setCurrentOnlinePlayerId,
	] = useState<PlayerId>();

	useEffect(() => {
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
	}, []);

	return currentOnlinePlayerId;
};

/** Handles redirecting to the game screen when room creator starts the game */
const useOnGameStart = ({ game, gameId, playerId }: UseOnGameStart) => {
	const { push } = useHistory();

	useEffect(() => {
		if (!game?.started) return;

		push(`${BASE_PATH}/online/${gameId}`, {
			playerId,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [game?.started]);
};

const useRoomLinkAndCopy = () => {
	// Generates the room link
	const {
		location: { origin, pathname },
	} = window;
	const link = origin + pathname;

	const [copyButtonText, setCopyButtonText] = useState('Copy Room Link');
	const onCopyText = () => {
		copyToClipboard(link);
		setCopyButtonText('Copied!');
	};

	return {
		copyButtonText,
		onCopyText,
	};
};

type WrapperProps = Pick<
	UseWatchOnlineGameProps,
	'onPlayerJoin' | 'game' | 'onStartGame'
> & {
	gameId: OnlineGameId;
};
const Wrapper = ({ gameId, game, onPlayerJoin, onStartGame }: WrapperProps) => {
	const currentOnlinePlayerId = useOnJoinRoom({
		game,
		onPlayerJoin,
	});
	useOnPlayerExitOnline(gameId, currentOnlinePlayerId);

	useOnGameStart({
		game,
		gameId,
		playerId: currentOnlinePlayerId,
	});

	const canStart = useCanStartGame(game.gamePlayers);

	const { copyButtonText, onCopyText } = useRoomLinkAndCopy();

	return (
		<PageContainer>
			<H1> Waiting Room </H1>
			<Spacer />
			<H4>
				Room ID:&nbsp;
				<span style={{ color: theme.palette.color.info }}>
					{gameId}
				</span>
				<Spacer />
				<TooltipButton
					text={copyButtonText}
					bg="primary"
					onClick={onCopyText}
					icon={CopyIcon}
				/>
			</H4>
			<PlayerDisplay
				players={game.gamePlayers}
				onStartGame={onStartGame}
				canStart={canStart}
				currentOnlinePlayerId={currentOnlinePlayerId}
			/>
		</PageContainer>
	);
};

const WaitingRoom = ({ gameId }: Props) => {
	const {
		pending,
		error,
		game,
		onPlayerJoin,
		onStartGame,
	} = useWatchOnlineGame(gameId);

	return (
		pending ||
		error || (
			<Wrapper
				gameId={gameId}
				game={game}
				onPlayerJoin={onPlayerJoin}
				onStartGame={onStartGame}
			/>
		)
	);
};

export default WaitingRoom;
