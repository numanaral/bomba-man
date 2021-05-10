import {
	FormControlLabel,
	Grid,
	Slider as MuiSlider,
	SliderProps,
} from '@material-ui/core';
import { cloneElement, forwardRef } from 'react';
import { PropsWithFormControl } from '../types';

const Slider = forwardRef<
	HTMLSpanElement,
	PropsWithFormControl<SliderProps> & { icon: React.ReactElement }
>(
	(
		{
			name,
			label,
			icon,
			color,
			valueLabelDisplay = 'auto',
			onChange,
			disabled,
			...rest
		},
		ref
	) => {
		const handleChange = (
			event: React.ChangeEvent<{}>,
			newValue: number | number[]
		) => {
			onChange(newValue);
		};

		const _color = disabled ? '#bdbdbd' : color;

		return (
			// 	<Typography id="continuous-slider" gutterBottom>
			// 	Volume
			//   </Typography>
			<FormControlLabel
				control={
					<Grid container spacing={2}>
						{icon && (
							<Grid item>
								{(_color &&
									cloneElement(icon, { color: _color })) ||
									icon}
							</Grid>
						)}
						<Grid item xs>
							<MuiSlider
								name={name}
								aria-labelledby={name}
								valueLabelDisplay={valueLabelDisplay}
								ref={ref}
								onChange={handleChange}
								disabled={disabled}
								{...rest}
							/>
						</Grid>
					</Grid>
				}
				labelPlacement="top"
				label={label}
				style={{ alignItems: 'flex-start' }}
			/>
		);
	}
);

export default Slider;
