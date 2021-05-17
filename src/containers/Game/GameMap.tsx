import { GameConfig, GameConfigRanges } from 'store/redux/reducers/game/types';
import Map from './components/Map';
import { PickedGameState } from './types';

interface Props
	extends PickedGameState<
		'gameMap' | 'is3D' | 'isSideView' | 'animationCounter'
	> {
	sizes: GameConfig['sizes'];
	firingDuration: GameConfigRanges.FiringDuration;
}

const GameMap: React.FC<Props> = ({ children, isSideView, ...rest }) => {
	return (
		<Map isTopView={!isSideView} {...rest}>
			{children}
		</Map>
	);
};

export type { Props as GameMapProps };
export default GameMap;
