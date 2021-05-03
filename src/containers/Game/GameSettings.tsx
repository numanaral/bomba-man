import { memo, useMemo } from 'react';
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

	const player2IsOn = !!P2;
	const npcIsOn = !!NPC;

	const buttons = useMemo(
		() =>
			[
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
					active: player2IsOn,
				},
				{ label: 'Toggle NPC', onClick: toggleNPC, active: npcIsOn },
			].map(({ label, ...rest }) => (
				<GameButton key={label} {...rest}>
					{label}
				</GameButton>
			)),
		[
			generateNewCollisionCoordinates,
			is3D,
			isSideView,
			npcIsOn,
			player2IsOn,
			toggleDimension,
			toggleNPC,
			togglePerspective,
			toggleTwoPlayer,
		]
	);

	return <div>{buttons}</div>;
};

export type { Props as GameSettingsProps };
export default memo(GameSettings);
