import {
	FormControlLabel,
	Grid,
	Slider as MuiSlider,
	SliderProps,
	Typography,
	useTheme,
} from '@material-ui/core';
import { cloneElement, forwardRef } from 'react';
import { PropsWithFormControl } from '../types';

const Slider = forwardRef<
	HTMLSpanElement,
	PropsWithFormControl<SliderProps> & {
		icon: React.ReactElement;
		helperText: string;
	}
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
			helperText,
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
		const theme = useTheme();

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
						{helperText && (
							<Grid container>
								<Typography
									variant="body2"
									style={{ color: theme.palette.error.main }}
								>
									{helperText}
								</Typography>
							</Grid>
						)}
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
