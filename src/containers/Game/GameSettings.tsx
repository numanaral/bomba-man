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

	const buttons = [
		{
			label: 'New Collision Coordinates',
			onClick: generateNewCollisionCoordinates,
		},
		{
			label: 'Toggle 3D (Experimental)',
			onClick: toggleDimension,
			active: is3D,
		},
		{
			label: 'Toggle Side View',
			onClick: togglePerspective,
			active: isSideView,
			disabled: !is3D,
		},
		{
			label: 'Toggle Two-Player Mode',
			onClick: toggleTwoPlayer,
			active: !!P2,
		},
		{ label: 'Toggle NPC', onClick: toggleNPC, active: !!NPC },
	];

	return (
		<div>
			{buttons.map(({ label, ...rest }) => (
				<GameButton key={label} {...rest}>
					{label}
				</GameButton>
			))}
		</div>
	);
};

export default Settings;
