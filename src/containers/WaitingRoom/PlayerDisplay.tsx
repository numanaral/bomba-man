import { OnlineGame, PlayerId } from 'containers/Game/types';
import {
	CharacterIconProps,
	CharacterIcon,
	GhostIcon,
} from 'containers/RoomCreator/icons';
import { Grid } from '@material-ui/core';
import ContainerWithCenteredItems from 'components/ContainerWithCenteredItems';
import Spacer from 'components/Spacer';
import TooltipButton from 'components/TooltipButton';
import { PlayerCondition } from 'enums';
import styled, { css } from 'styled-components';
import { ghostAnimation } from 'animations';
import theme from 'theme';

interface Props {
	players: OnlineGame['gamePlayers'];
	currentOnlinePlayerId?: PlayerId;
	canStart?: boolean;
	onStartGame?: CallableFunction;
	isGameEnd?: boolean;
}

const FloatingGhostIcon = styled(GhostIcon)<{
	$size: number;
	$playerId: PlayerId;
}>`
	${({ $size, $playerId }) => {
		const { warning, info, success, error } = theme.palette.color;
		const colors = [warning, info, success, error];
		const color = colors[Number($playerId.replace('P', '')) - 1];

		return css`
			font-size: ${$size}px;
			animation: ${ghostAnimation($size, color)} 3s infinite;
			border-radius: 50%;
		`;
	}}
`;

const PlayerDisplay = ({
	players,
	currentOnlinePlayerId,
	onStartGame,
	isGameEnd = false,
	canStart = false,
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
								disabled={!canStart}
								onClick={onStartGame as ReactOnButtonClick}
							/>
						</Grid>
					</ContainerWithCenteredItems>
				</>
			)}
			<Spacer spacing="15" />
			<Grid container justify="space-between" item xs={12} sm={8}>
				{Object.keys(players)
					.sort()
					.map(id => {
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

						const props: CharacterIconProps &
							Partial<JSX.Element> = {
							key: id,
							size,
							name: id,
							id: id as PlayerId,
							showName: true,
							isWalking,
						};

						return isGameEndDeadCharacter ? (
							<FloatingGhostIcon
								id={id}
								key={id}
								$size={size}
								$playerId={id as PlayerId}
							/>
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
