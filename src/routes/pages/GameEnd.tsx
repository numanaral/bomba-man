import PageContainer from 'components/PageContainer';
import { RouteComponentPropsWithLocationState } from 'routes/types';
import { H1 } from 'components/typography';
import theme from 'theme';
import { useHistory } from 'react-router-dom';
import { BASE_PATH } from 'routes/constants';
import { useEffect } from 'react';
import { GameEndCondition } from 'enums';
import PlayerDisplay from 'containers/WaitingRoom/PlayerDisplay';

interface Props extends RouteComponentPropsWithLocationState {}

// TODO
const GameEnd = ({ location }: Props) => {
	const { push } = useHistory();
	const endGame = location?.state?.endGame;

	// This room requires a message, otherwise redirect to home
	useEffect(() => {
		if (!endGame) push(`${BASE_PATH}/`);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!endGame) return null;

	const { gameEndCondition, ...playerDisplayProps } = endGame!;

	const isWon = gameEndCondition === GameEndCondition.Win;
	const emoji = isWon ? ':)' : ':(';

	return (
		<PageContainer>
			<H1>
				You have{' '}
				<span
					style={{
						color:
							theme.palette.color[
								isWon
									? 'success'
									: ('error' as KeysOf<
											typeof theme.palette.color
									  >)
							],
					}}
				>
					{gameEndCondition}
				</span>{' '}
				the game {emoji}
			</H1>
			<PlayerDisplay {...playerDisplayProps} isGameEnd />
		</PageContainer>
	);
};

export default GameEnd;
