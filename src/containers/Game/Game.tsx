import config from 'config';
import usePlayerEvents from 'hooks/usePlayerEvents';
import { npcAction } from 'utils/game';
import {
	makeSelectGameAnimationCounter,
	makeSelectGameIs3D,
	makeSelectGameIsSideView,
	makeSelectGameMap,
	makeSelectGamePlayers,
} from 'store/redux/reducers/game/selectors';
import { useSelector } from 'react-redux';
import useGameProvider from 'store/redux/hooks/useGameProvider';
import GameContainer from './GameContainer';
import Map from './Map';
import { Players } from './types';
import Settings from './Settings';
import GameContent from './GameContent';

const Game = () => {
	const { dropBomb, makeMove } = useGameProvider();
	const gameMap = useSelector(makeSelectGameMap());
	const is3D = useSelector(makeSelectGameIs3D());
	const players = useSelector(makeSelectGamePlayers());
	const isTopView = !useSelector(makeSelectGameIsSideView());
	const animationCounter = useSelector(makeSelectGameAnimationCounter());

	usePlayerEvents(
		players,
		makeMove,
		gameMap,
		is3D,
		dropBomb,
		...((!!players.P3 && [npcAction]) || [])
	);

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
