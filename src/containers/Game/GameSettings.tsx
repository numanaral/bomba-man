import {
	makeSelectGameIs3D,
	makeSelectGameIsSideView,
	makeSelectGamePlayers,
} from 'store/redux/reducers/game/selectors';
import { useSelector } from 'react-redux';
import useGameProvider from 'store/redux/hooks/useGameProvider';
import GameButton from './GameButton';

const Settings = () => {
	const {
		generateNewCollisionCoordinates,
		togglePerspective,
		toggleDimension,
		toggleTwoPlayer,
		toggleNPC,
	} = useGameProvider();

	const is3D = useSelector(makeSelectGameIs3D());
	const isSideView = useSelector(makeSelectGameIsSideView());
	const { P2, P3: NPC } = useSelector(makeSelectGamePlayers());

	return (
		<div>
			<GameButton onClick={generateNewCollisionCoordinates}>
				New Collision Coordinates
			</GameButton>
			<GameButton active={is3D} onClick={toggleDimension}>
				Toggle 3D (Experimental)
			</GameButton>
			<GameButton
				active={isSideView}
				onClick={togglePerspective}
				disabled={!is3D}
			>
				Toggle Side View
			</GameButton>
			<br />
			<GameButton active={!!P2} onClick={toggleTwoPlayer}>
				Toggle Two-Player Mode
			</GameButton>
			<GameButton active={!!NPC} onClick={toggleNPC}>
				Toggle NPC
			</GameButton>

			<br />
			<br />
		</div>
	);
};

export default Settings;
