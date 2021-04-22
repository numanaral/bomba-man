import usePlayerEvents from 'store/redux/hooks/usePlayerEvents';
import GameContainer from './GameContainer';
import Settings from './GameSettings';
import GameContent from './GameContent';
import GameMap from './GameMap';

const Game = () => {
	usePlayerEvents();

	return (
		<GameContainer>
			<Settings />
			<GameMap>
				<GameContent />
			</GameMap>
		</GameContainer>
	);
};

export default Game;
