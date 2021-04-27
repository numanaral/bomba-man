import { PowerUp as PowerUpEnum } from 'enums';
import icons from './icons';

interface Props {
	variant: PowerUpEnum;
	size: number;
	top: number;
	left: number;
}

const PowerUp = ({ variant, top, left, size }: Props) => {
	const { icon: Icon, color } = icons[variant];
	return (
		<div
			style={{
				position: 'absolute',
				top,
				left,
				width: size,
				height: size,
			}}
		>
			<Icon color={color} />
		</div>
	);
};

export default PowerUp;
