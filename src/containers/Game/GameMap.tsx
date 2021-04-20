import config from 'config';
import {
	makeSelectGameAnimationCounter,
	makeSelectGameIs3D,
	makeSelectGameIsSideView,
	makeSelectGameMap,
} from 'store/redux/reducers/game/selectors';
import { useSelector } from 'react-redux';
import Map from './components/Map';

const GameMap: React.FC = ({ children }) => {
	const gameMap = useSelector(makeSelectGameMap());
	const is3D = useSelector(makeSelectGameIs3D());
	const isTopView = !useSelector(makeSelectGameIsSideView());
	const animationCounter = useSelector(makeSelectGameAnimationCounter());

	return (
		<Map
			size={config.size.game}
			gameMap={gameMap}
			is3D={is3D}
			isTopView={isTopView}
			animationCounter={animationCounter}
		>
			{children}
		</Map>
	);
};

export default GameMap;
