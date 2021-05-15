import Container from 'components/Container';
import { NAV_LIST } from 'routes/pages-and-roles';
import styled from 'styled-components';
import LinkButton from 'components/LinkButton';
import { Fragment } from 'react';
import Spacer from 'components/Spacer';
// import SpriteCharacter from 'containers/Game/components/SpriteCharacter';
import { CharacterIcon } from 'containers/RoomCreator/icons';
import useInterval from 'hooks/useInterval';
import TooltipButton from 'components/TooltipButton';
import useLocalStorage from 'hooks/useLocalStorage';
import * as colors from '@material-ui/core/colors';
import theme from 'theme';

// const size = 8;

// const CharacterWrapper = styled.div`
// 	position: relative;
// 	width: ${size * 32}px;
// 	height: ${size * 32}px;

// 	.character {
// 		.spritesheet-wrapper {
// 			width: calc(32px * ${size}) !important;
// 			height: calc(32px * ${size}) !important;

// 			& .spritesheet {
// 				width: calc(32px * ${size * 4}) !important;
// 				height: calc(32px * ${size * 4}) !important;
// 			}
// 		}
// 	}
// `;

const Menu = styled(Container)`
	flex-direction: column;
	& button {
		width: 200px;
	}
`;

const getColor = (colorMap: Array<string>, ind: number) => {
	return {
		style: {
			backgroundColor: colorMap[ind % 4],
		},
	};
};

const colorKeys = Array.from({ length: 9 }, (_, i) => `${(i + 1) * 100}`);
const getAndMapMuiColors = () => {
	return Object.values(colors)
		.map(color => {
			return colorKeys.map(key => color[key as KeysOf<typeof color>]);
		})
		.flat();
};

const RAINBOW_COLORS_LSK = 'RAINBOW_COLORS';
const useRainbowColors = (stopIt: boolean) => {
	const [colorMap, setColorMap] = useLocalStorage(
		RAINBOW_COLORS_LSK,
		getAndMapMuiColors()
	);

	const reOrderColors = () => {
		setColorMap(v => [...v.slice(1), v[0]]);
	};

	useInterval(reOrderColors, 100, stopIt);

	return colorMap;
};

const STOP_COLOR_ROTATION_LSK = 'STOP_COLOR_ROTATION';
const DONT_SHOW_AGAIN_LSK = 'DONT_SHOW_AGAIN';
const Home = () => {
	const [stopIt, setStopIt] = useLocalStorage(STOP_COLOR_ROTATION_LSK, false);
	const [dontShowAgain, setDontShowAgain] = useLocalStorage(
		DONT_SHOW_AGAIN_LSK,
		false
	);

	const colorMap = useRainbowColors(dontShowAgain || stopIt);

	const toggleColorRotation = () => {
		setStopIt(v => !v);
	};

	const dontYouShowMeThisRandomStuff = () => {
		setDontShowAgain(true);
	};

	return (
		<Container>
			<Spacer spacing="5" />
			<CharacterIcon
				size={100}
				color={theme.palette.color.primary}
				showName
				isWalking
			/>
			<Spacer spacing="5" />
			{/* <CharacterWrapper>
				<SpriteCharacter
					coordinates={{ top: 0, left: 0 }}
					id="P1"
					name="Bomba-man"
					isWalking
					size={100}
				/>
			</CharacterWrapper> */}
			<Menu>
				{NAV_LIST.filter(link => link.label !== 'Home').map(
					({ to, text }, ind) => (
						<Fragment key={to}>
							<LinkButton to={to} {...getColor(colorMap, ind)}>
								{text}
							</LinkButton>
							<Spacer />
						</Fragment>
					)
				)}
			</Menu>
			{!dontShowAgain && (
				<TooltipButton
					text={
						stopIt ? 'Nvm, let the colors shine!' : 'Please stop!'
					}
					variant="outlined"
					onClick={toggleColorRotation}
				/>
			)}
			{stopIt && !dontShowAgain && (
				<>
					<Spacer />
					<TooltipButton
						text="No, just get rid of this FOREVER!"
						variant="outlined"
						onClick={dontYouShowMeThisRandomStuff}
					/>
				</>
			)}
		</Container>
	);
};

export default Home;
