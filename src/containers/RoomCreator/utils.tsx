import { PowerUp } from 'enums';
import powerUpIcons from 'containers/Game/components/PowerUp/icons';
import { findEnumKeyFromValue } from 'utils';
import { FormComponent } from 'components/Form/types';
import { generateMarks } from 'utils/material-ui';
import { PartialConfigFormItems, PowerUpIcons } from './types';
import { powerUpIconPack } from './icons';

const generateIconPackFromPowerUps = (iconStyle: React.CSSProperties) => {
	return Object.values(PowerUp).reduce<PowerUpIcons>((acc, key) => {
		const { icon: Icon, color } = powerUpIcons[key];

		acc[key] = {
			icon: <Icon style={iconStyle} />,
			color,
		};

		return acc;
	}, {} as PowerUpIcons);
};
const generatePowerUpSection = (
	name: string,
	max: number,
	movementStops?: Array<number>
) => {
	return Object.values(PowerUp).map(powerUp => {
		const label = `${findEnumKeyFromValue(PowerUp, powerUp)}`;
		return {
			type: FormComponent.Rating,
			label: `${label} (number)`,
			name: `${name}.${powerUp}`,
			max,
			...powerUpIconPack[powerUp],
			...(movementStops &&
				powerUp === PowerUp.MovementSpeed && {
					label: `${label} (action interval, milliseconds)`,
					type: FormComponent.Slider,
					step: null,
					min: Math.min(...movementStops),
					max: Math.max(...movementStops),
					marks: generateMarks(movementStops),
				}),
		};
	}) as PartialConfigFormItems;
};

export { generateIconPackFromPowerUps, generatePowerUpSection };
