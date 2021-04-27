import GameButton from './GameButton';
import { GameApi } from './types';

interface Props extends GameApi {}

const GameSettings = ({ state, provider }: Props) => {
	const {
		generateNewCollisionCoordinates,
		togglePerspective,
		toggleDimension,
		toggleTwoPlayer,
		toggleNPC,
	} = provider;

	const {
		is3D,
		isSideView,
		players: { P2, P4: NPC },
	} = state;

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

export type { Props as GameSettingsProps };
export default GameSettings;
