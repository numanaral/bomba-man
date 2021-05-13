import { memo, useMemo } from 'react';
import GameButton from './GameButton';
import { GameApi } from './types';

interface Props extends GameApi {}

const GameSettings = ({ state, provider }: Props) => {
	const {
		generateNewCollisionCoordinates,
		togglePerspective,
		toggleDimension,
	} = provider;

	const { is3D, isSideView } = state;

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
			].map(({ label, ...rest }) => (
				<GameButton key={label} {...rest}>
					{label}
				</GameButton>
			)),
		[
			generateNewCollisionCoordinates,
			is3D,
			isSideView,
			toggleDimension,
			togglePerspective,
		]
	);

	return <div>{buttons}</div>;
};

export type { Props as GameSettingsProps };
export default memo(GameSettings);
