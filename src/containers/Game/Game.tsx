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
		gameId,
		type,
	} = props;

	const gameContainerProps = {
		is3D,
	};

	const gameSettingProps = {
		...props,
		type,
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
		gameId,
	};

	return {
		gameContainerProps,
		gameSettingProps,
		gameMapProps,
		gameContentProps,
	};
};

const Game = (props: GameApi) => {
	const playerIntervals = usePlayerEvents(props);
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
			{playerIntervals}
		</GameContainer>
	);
};

export default Game;
