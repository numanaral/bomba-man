import gameConfig from 'config';
import PageContainer from 'components/PageContainer';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	FontAwesomeIconProps,
	KeyboardEventCode,
	KeyMap,
	PlayerActionKeys,
	PlayerId,
} from 'containers/Game/types';
import { H1, H4 } from 'components/typography';
import { Grid } from '@material-ui/core';
import Container from 'components/Container';
import styled from 'styled-components';
import { CharacterIcon } from 'containers/RoomCreator/icons';
import Spacer from 'components/Spacer';
import theme from 'theme';
import * as KeyCode from 'keycode-js';
import { useKeyboardEvent } from 'store/redux/hooks/usePlayerEvents';
import { useState } from 'react';

const KeyboardIcon = (props: FontAwesomeIconProps) => (
	<FontAwesomeIcon icon={faKeyboard} {...props} />
);

type IsPressed = { isPressed?: boolean };

const KeyboardIconWrapper = styled(Container)<
	StyledProps<Required<SquareIconProps> & IsPressed>
>`
	border: 2px solid;
	border-radius: 4px;
	padding: 10px;
	font-weight: bold;
	height: 45px;
	transition: 0.3s;

	${({ $length, $size, $isPressed }) => {
		return `
			height: ${$size}px;
			width: ${$size * $length}px;
			${
				$isPressed
					? `
						background: white;
						color: ${theme.palette.background.primary};
						border: 2px dashed ${theme.palette.background.primary};
				`
					: ''
			}
		`;
	}}
`;

interface SquareIconProps {
	size?: number;
	length?: number;
}

const SquareIcon: React.FC<SquareIconProps & IsPressed> = ({
	children,
	size = 45,
	length = 1,
	isPressed,
}) => (
	<KeyboardIconWrapper $length={length} $size={size} $isPressed={isPressed}>
		{children}
	</KeyboardIconWrapper>
);

interface KeyboardSetupContainerProps {
	keyboardConfig: Record<
		PlayerActionKeys,
		{
			label: string;
			keyCode: KeyboardEventCode;
		}
	>;
}

const KeyboardSetupContainer = ({
	keyboardConfig,
}: KeyboardSetupContainerProps) => {
	const { DropBomb, MoveDown, MoveLeft, MoveRight, MoveUp } = keyboardConfig;
	const bombKeyLength = DropBomb.label.length > 1 ? 3 : 1;

	const [keyMap, setKeyMap] = useState<KeyMap>({});
	useKeyboardEvent({
		onKeyDown: keyEventCode => {
			setKeyMap(v => ({
				...v,
				[keyEventCode]: true,
			}));
		},
		onKeyUp: keyEventCode => {
			setKeyMap(v => ({
				...v,
				[keyEventCode]: false,
			}));
		},
	});

	return (
		<Grid container>
			<Grid container style={{ width: 45 * 3 }}>
				<Grid container item xs={12} justify="center">
					<SquareIcon isPressed={keyMap[MoveUp.keyCode]}>
						{MoveUp.label}
					</SquareIcon>
				</Grid>
				<Grid container item xs={12}>
					{[MoveLeft, MoveDown, MoveRight].map(
						({ label, keyCode }) => (
							<SquareIcon
								isPressed={keyMap[keyCode as KeyboardEventCode]}
								key={label}
							>
								{label}
							</SquareIcon>
						)
					)}
				</Grid>
			</Grid>
			<Grid style={{ width: 10 }} />
			<Grid
				container
				style={{ width: 45 * 3 }}
				justify="center"
				alignItems="flex-end"
			>
				<SquareIcon
					isPressed={keyMap[DropBomb.keyCode]}
					length={bombKeyLength}
				>
					{DropBomb.label}
				</SquareIcon>
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
	const isLeft = side === 'left';

	const playerIdIndex = Number(playerId.replace('P', '')) - 1;

	return (
		<Grid container xs={12} justify="center">
			<Grid item {...(!isLeft && { style: { order: 3 } })}>
				<CharacterIcon
					size={80}
					name={playerId}
					id={playerId}
					showName
					isWalking
					isNPC={false}
					keyboardConfig={{
						'0': gameConfig.keyboardConfig[playerIdIndex],
					}}
				/>
			</Grid>
			<Grid item>
				<KeyboardSetupContainer keyboardConfig={keyboardConfig} />
			</Grid>
		</Grid>
	);
};

const Instructions = () => {
	return (
		<PageContainer style={{ overflow: 'hidden' }}>
			<Grid container justify="center" alignItems="center">
				<KeyboardIcon size="3x" /> &nbsp;&nbsp;
				<H1> Instructions </H1>
				<H4 style={{ width: '100%' }}>
					NOTE: In an online game, you can use both setup
				</H4>
				<H4 style={{ width: '100%' }}>
					NOTE2: You can test the keys on this screen :)
				</H4>
			</Grid>
			<Spacer spacing="10" />
			<PlayerSetupContainer
				playerId="P1"
				keyboardConfig={{
					MoveUp: {
						label: 'W',
						keyCode: KeyCode.CODE_W,
					},
					MoveRight: {
						label: 'D',
						keyCode: KeyCode.CODE_D,
					},
					MoveDown: {
						label: 'S',
						keyCode: KeyCode.CODE_S,
					},
					MoveLeft: {
						label: 'A',
						keyCode: KeyCode.CODE_A,
					},
					DropBomb: {
						label: 'Space',
						keyCode: KeyCode.CODE_SPACE,
					},
				}}
			/>
			<Spacer spacing="10" />
			<PlayerSetupContainer
				playerId="P2"
				keyboardConfig={{
					MoveUp: {
						label: '↑',
						keyCode: KeyCode.CODE_UP,
					},
					MoveRight: {
						label: '→',
						keyCode: KeyCode.CODE_RIGHT,
					},
					MoveDown: {
						label: ' ↓',
						keyCode: KeyCode.CODE_DOWN,
					},
					MoveLeft: {
						label: '←',
						keyCode: KeyCode.CODE_LEFT,
					},
					DropBomb: {
						label: ';',
						keyCode: KeyCode.CODE_SEMICOLON,
					},
				}}
				side="right"
			/>
		</PageContainer>
	);
};

export default Instructions;
