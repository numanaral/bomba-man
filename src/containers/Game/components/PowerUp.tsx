import { PowerUp as PowerUpEnum } from 'enums';

interface Props {
	variant: PowerUpEnum;
	size: number;
	top: number;
	left: number;
}

const PowerUp = ({ variant, top, left, size }: Props) => {
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
			{variant}
		</div>
	);
};

export default PowerUp;
