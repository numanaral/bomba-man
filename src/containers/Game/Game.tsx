import config from 'config';
import usePlayerEvents from 'store/redux/hooks/usePlayerEvents';
import {
	makeSelectGameAnimationCounter,
	makeSelectGameIs3D,
	makeSelectGameIsSideView,
	makeSelectGameMap,
} from 'store/redux/reducers/game/selectors';
import { useSelector } from 'react-redux';
import GameContainer from './GameContainer';
import Map from './Map';
import { Players } from './types';
import Settings from './Settings';
import GameContent from './GameContent';

const Game = () => {
	const gameMap = useSelector(makeSelectGameMap());
	const is3D = useSelector(makeSelectGameIs3D());
	const isTopView = !useSelector(makeSelectGameIsSideView());
	const animationCounter = useSelector(makeSelectGameAnimationCounter());

	usePlayerEvents();

	return (
		<GameContainer>
			<Settings />
			<Map
				size={config.size.game}
				gameMap={gameMap}
				is3D={is3D}
				isTopView={isTopView}
				animationCounter={animationCounter}
			>
				<GameContent />
			</Map>
		</GameContainer>
	);
};

export type { Players };
export default Game;
