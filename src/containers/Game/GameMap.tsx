import { GameConfig } from 'store/redux/reducers/game/types';
import Map from './components/Map';
import { PickedGameState } from './types';

interface Props
	extends PickedGameState<
		'gameMap' | 'is3D' | 'isSideView' | 'animationCounter'
	> {
	sizes: GameConfig['sizes'];
}

const GameMap: React.FC<Props> = ({
	sizes: { map: mapSize, tile: tileSize },
	children,
	gameMap,
	is3D,
	isSideView,
	animationCounter,
}) => {
	return (
		<Map
			size={mapSize}
			gameMap={gameMap}
			is3D={is3D}
			isTopView={!isSideView}
			animationCounter={animationCounter}
			tileSize={tileSize}
		>
			{children}
		</Map>
	);
};

export type { Props as GameMapProps };
export default GameMap;
