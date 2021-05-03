import usePlayerEvents from 'store/redux/hooks/usePlayerEvents';
import GameContainer from './GameContainer';
import GameSettings from './GameSettings';
import GameContent from './GameContent';
import GameMap from './GameMap';
import { GameApi } from './types';

const useGameProps = (props: GameApi) => {
	const {
		state: { is3D, gameMap, isSideView, animationCounter, config },
		// provider,
	} = props;

	const gameContainerProps = {
		is3D,
	};

	const gameSettingProps = {
		...props,
	};

	const gameMapProps = {
		sizes: config.sizes,
		gameMap,
		is3D,
		isSideView,
		animationCounter,
	};

	const gameContentProps = {
		...props,
	};

	return {
		gameContainerProps,
		gameSettingProps,
		gameMapProps,
		gameContentProps,
	};
};

const Game = (props: GameApi) => {
	usePlayerEvents(props);
	const {
		gameContainerProps,
		gameSettingProps,
		gameMapProps,
		gameContentProps,
	} = useGameProps(props);

	return (
		<GameContainer {...gameContainerProps}>
			<GameSettings {...gameSettingProps} />
			<GameMap {...gameMapProps}>
				<GameContent {...gameContentProps} />
			</GameMap>
		</GameContainer>
	);
};

export default Game;
