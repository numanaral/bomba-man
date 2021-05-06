import { PowerUp as PowerUpEnum } from 'enums';
import TileIcon from '../TileIcon';
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
		<TileIcon $top={top} $left={left} $size={size}>
			<Icon color={color} />
		</TileIcon>
	);
};

export default PowerUp;
