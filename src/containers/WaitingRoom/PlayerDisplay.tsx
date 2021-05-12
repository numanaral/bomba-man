import { OnlineGame, PlayerId } from 'containers/Game/types';
import { CharacterIcon } from 'containers/RoomCreator/icons';
import { Grid } from '@material-ui/core';
import ContainerWithCenteredItems from 'components/ContainerWithCenteredItems';
import Spacer from 'components/Spacer';
import TooltipButton from 'components/TooltipButton';

interface Props {
	players: OnlineGame['players'];
	currentOnlinePlayerId?: PlayerId;
	onStartGame: CallableFunction;
}

const PlayerDisplay = ({
	players,
	currentOnlinePlayerId,
	onStartGame,
}: Props) => {
	return (
		<ContainerWithCenteredItems container>
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
			<Spacer spacing="15" />
			<Grid container justify="space-between" item xs={12} sm={8}>
				{Object.keys(players).map(id => {
					const isCurrentPlayer = currentOnlinePlayerId === id;
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
	);
};

export default PlayerDisplay;
