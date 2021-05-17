import { OnlineGame, PlayerId } from 'containers/Game/types';
import {
	CharacterIconProps,
	CharacterIcon,
	GhostIcon,
} from 'containers/RoomCreator/icons';
import { Grid, Theme, useMediaQuery } from '@material-ui/core';
import ContainerWithCenteredItems from 'components/ContainerWithCenteredItems';
import Spacer from 'components/Spacer';
import TooltipButton, { TooltipButtonProps } from 'components/TooltipButton';
import { PlayerCondition } from 'enums';
import styled, { css } from 'styled-components';
import { ghostAnimation } from 'animations';
import theme from 'theme';
import { useState } from 'react';

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

const RoomButton = (props: TooltipButtonProps) => {
	return (
		<>
			<Spacer spacing="5" />
			<ContainerWithCenteredItems container>
				<Grid container justify="center" item xs={12} sm={4}>
					<TooltipButton
						fullWidth
						bg="primary"
						variant="contained"
						{...props}
					/>
				</Grid>
			</ContainerWithCenteredItems>
		</>
	);
};

const PlayerDisplay = ({
	players,
	currentOnlinePlayerId,
	onStartGame,
	isGameEnd = false,
	canStart = false,
}: Props) => {
	const xsAndDown = useMediaQuery<Theme>(t => t.breakpoints.down('xs'));
	const [isSubmitting, setIsSubmitting] = useState(false);
	const _onStartGame = () => {
		setIsSubmitting(true);
		try {
			onStartGame?.();
		} catch (err) {
			// eslint-disable-next-line no-alert
			alert(err.message);
			setIsSubmitting(false);
		}
	};

	return (
		<ContainerWithCenteredItems container>
			{/* Only P1 can start/restart the game */}
			{currentOnlinePlayerId === 'P1' && (
				<RoomButton
					text={isGameEnd ? 'Restart' : 'Start'}
					onClick={_onStartGame}
					pending={isSubmitting}
					disabled={!canStart || isSubmitting}
				/>
			)}
			<Spacer spacing={xsAndDown ? 5 : 10} />
			<Grid container justify="space-between" item xs={10} md={9} lg={8}>
				{Object.keys(players || {})
					.sort()
					.map((id, ind) => {
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

						return (
							<Grid
								container
								justify="center"
								alignItems="flex-end"
								item
								xs={6}
								sm={3}
								// md={3}
								key={id}
							>
								{xsAndDown && ind !== 0 && (
									<Spacer spacing="10" />
								)}
								{isGameEndDeadCharacter ? (
									<FloatingGhostIcon
										id={id}
										$size={size}
										$playerId={id as PlayerId}
									/>
								) : (
									<CharacterIcon {...props} />
								)}
							</Grid>
						);
					})}
			</Grid>
			<Spacer spacing="5" />
		</ContainerWithCenteredItems>
	);
};

export type { Props as PlayerDisplayProps };
export default PlayerDisplay;
