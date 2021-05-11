import PageContainer from 'components/PageContainer';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	FontAwesomeIconProps,
	PlayerActionKeys,
	PlayerId,
} from 'containers/Game/types';
import { H1 } from 'components/typography';
import {
	Grid,
	GridJustification,
	Theme,
	useMediaQuery,
} from '@material-ui/core';
import Container from 'components/Container';
import styled from 'styled-components';
import { CharacterIcon } from 'containers/RoomCreator/icons';
import Spacer from 'components/Spacer';

const KeyboardIcon = (props: FontAwesomeIconProps) => (
	<FontAwesomeIcon icon={faKeyboard} {...props} />
);

const KeyboardIconWrapper = styled(Container)<
	StyledProps<Required<SquareIconProps>>
>`
	border: 2px solid;
	border-radius: 4px;
	padding: 10px;
	font-weight: bold;
	height: 45px;
	${({ $length, $size }) => {
		return `
			height: ${$size}px;
			width: ${$size * $length}px;
		`;
	}}
`;

interface SquareIconProps {
	size?: number;
	length?: number;
}

const SquareIcon: React.FC<SquareIconProps> = ({
	children,
	size = 45,
	length = 1,
}) => (
	<KeyboardIconWrapper $length={length} $size={size}>
		{children}
	</KeyboardIconWrapper>
);

interface KeyboardSetupContainerProps {
	keyboardConfig: Record<PlayerActionKeys, string>;
}

const KeyboardSetupContainer = ({
	keyboardConfig,
}: KeyboardSetupContainerProps) => {
	const { DropBomb, MoveDown, MoveLeft, MoveRight, MoveUp } = keyboardConfig;
	const bombKeyLength = DropBomb.length > 1 ? 3 : 1;

	return (
		<Grid container>
			<Grid container style={{ width: 45 * 3 }}>
				<Grid container item xs={12} justify="center">
					<SquareIcon>{MoveUp}</SquareIcon>
				</Grid>
				<Grid container item xs={12}>
					{[MoveLeft, MoveDown, MoveRight].map(key => (
						<SquareIcon key={key}>{key}</SquareIcon>
					))}
				</Grid>
			</Grid>
			<Grid style={{ width: 10 }} />
			<Grid
				container
				style={{ width: 45 * 3 }}
				justify="center"
				alignItems="flex-end"
			>
				<SquareIcon length={bombKeyLength}>{DropBomb}</SquareIcon>
			</Grid>
		</Grid>
	);
};

interface PlayerSetupContainerProps extends KeyboardSetupContainerProps {
	side?: 'left' | 'right';
	playerId: PlayerId;
}

const PlayerSetupContainer = ({
	keyboardConfig,
	playerId,
	side = 'left',
}: PlayerSetupContainerProps) => {
	const smAndDown = useMediaQuery<Theme>(theme =>
		theme.breakpoints.down('sm')
	);
	const isLeft = side === 'left';

	return (
		<Grid container {...(!isLeft && { justify: 'flex-end' })}>
			<Grid
				container
				item
				xs={12}
				md={6}
				justify={
					`flex-${
						smAndDown || isLeft ? 'start' : 'end'
					}` as GridJustification
				}
			>
				<Grid item {...(!isLeft && { style: { order: 3 } })}>
					<CharacterIcon
						size={80}
						name={playerId}
						id={playerId}
						showId
						isWalking
					/>
				</Grid>
				<Grid item>
					<KeyboardSetupContainer keyboardConfig={keyboardConfig} />
				</Grid>
			</Grid>
		</Grid>
	);
};

const Instructions = () => {
	return (
		<PageContainer style={{ overflow: 'hidden' }}>
			<Grid container justify="center" alignItems="center">
				<KeyboardIcon size="3x" /> &nbsp;&nbsp;
				<H1>Instruction</H1>
			</Grid>
			<Spacer spacing="10" />
			<PlayerSetupContainer
				playerId="P1"
				keyboardConfig={{
					MoveUp: 'W',
					MoveLeft: 'A',
					MoveDown: 'S',
					MoveRight: 'D',
					DropBomb: 'Space',
				}}
			/>
			<Spacer spacing="10" />
			<PlayerSetupContainer
				playerId="P2"
				keyboardConfig={{
					MoveUp: '↑',
					MoveLeft: '←',
					MoveDown: ' ↓',
					MoveRight: '→',
					DropBomb: ';',
				}}
				side="right"
			/>
		</PageContainer>
	);
};

export default Instructions;
