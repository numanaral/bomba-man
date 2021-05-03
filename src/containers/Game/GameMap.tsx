import config from 'config';
import Map from './components/Map';
import { PickedGameState } from './types';

interface Props
	extends PickedGameState<
		'gameMap' | 'is3D' | 'isSideView' | 'animationCounter'
	> {}

const GameMap: React.FC<Props> = ({
	children,
	gameMap,
	is3D,
	isSideView,
	animationCounter,
}) => {
	return (
		<Map
			size={config.size.game}
			gameMap={gameMap}
			is3D={is3D}
			isTopView={!isSideView}
			animationCounter={animationCounter}
		>
			{children}
		</Map>
	);
};

export type { Props as GameMapProps };
export default GameMap;
