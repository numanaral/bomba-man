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
import { PlayerCondition } from 'enums';

interface Props {
	players: OnlineGame['players'];
	currentOnlinePlayerId?: PlayerId;
	onStartGame?: CallableFunction;
	isGameEnd?: boolean;
}

const PlayerDisplay = ({
	players,
	currentOnlinePlayerId,
	onStartGame,
	isGameEnd = false,
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
					const isGameEndDeadCharacter =
						isGameEnd &&
						players[id as PlayerId] === PlayerCondition.Dead;

					let size = 50;
					let isWalking = false;

					if (
						(isCurrentPlayer &&
							(!isGameEnd || !isGameEndDeadCharacter)) ||
						(!isCurrentPlayer &&
							isGameEnd &&
							!isGameEndDeadCharacter)
					) {
						size = 80;
						isWalking = true;
					}

					const props: CharacterIconProps = {
						size,
						name: id,
						id: id as PlayerId,
						showId: true,
						isWalking,
					};

					return isGameEndDeadCharacter ? (
						<DeadCharacterIcon {...props} />
					) : (
						<CharacterIcon {...props} />
					);
				})}
			</Grid>
			<Spacer spacing="5" />
		</ContainerWithCenteredItems>
	);
};

export type { Props as PlayerDisplayProps };
export default PlayerDisplay;
