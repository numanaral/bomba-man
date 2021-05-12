import { OnlineGame, PlayerId } from 'containers/Game/types';
import {
	CharacterIconProps,
	CharacterIcon,
	DeadCharacterIcon,
} from 'containers/RoomCreator/icons';
import { Grid } from '@material-ui/core';
import ContainerWithCenteredItems from 'components/ContainerWithCenteredItems';
import Spacer from 'components/Spacer';
import TooltipButton from 'components/TooltipButton';
import { EndGameCondition } from 'enums';
import { doesNotExist } from 'utils';

interface Props {
	players: OnlineGame['players'];
	currentOnlinePlayerId?: PlayerId;
	onStartGame?: CallableFunction;
	endGameCondition?: EndGameCondition;
}

const PlayerDisplay = ({
	players,
	currentOnlinePlayerId,
	onStartGame,
	endGameCondition,
}: Props) => {
	return (
		<ContainerWithCenteredItems container>
			{onStartGame && (
				<>
					<Spacer spacing="5" />
					<ContainerWithCenteredItems container>
						<Grid container justify="center" item xs={12} sm={4}>
							<TooltipButton
								text="Start"
								fullWidth
								bg="primary"
								variant="contained"
								disabled={Object.keys(players).length <= 1}
								onClick={onStartGame as ReactOnButtonClick}
							/>
						</Grid>
					</ContainerWithCenteredItems>
				</>
			)}
			<Spacer spacing="15" />
			<Grid container justify="space-between" item xs={12} sm={8}>
				{Object.keys(players).map(id => {
					const isCurrentPlayer = currentOnlinePlayerId === id;
					const isEndGameDeadCharacter =
						!doesNotExist(endGameCondition) &&
						endGameCondition === EndGameCondition.Lose;

					const props: CharacterIconProps = {
						size: isCurrentPlayer ? 80 : 50,
						name: id,
						id: id as PlayerId,
						showId: true,
						isWalking: isCurrentPlayer,
					};

					return isEndGameDeadCharacter ? (
						<DeadCharacterIcon {...props} />
					) : (
						<CharacterIcon {...props} />
					);
				})}
			</Grid>
		</ContainerWithCenteredItems>
	);
};

export type { Props as PlayerDisplayProps };
export default PlayerDisplay;
