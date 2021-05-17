import { FormControlLabel } from '@material-ui/core';
import { Rating as MuiRating, RatingProps } from '@material-ui/lab';
import { forwardRef } from 'react';
import styled from 'styled-components';
import { PropsWithFormControl } from '../types';

const Wrapper = styled(MuiRating)`
	${({ color }) => {
		return `
			color: ${color}
		`;
	}}
`;

const Rating = forwardRef<HTMLSpanElement, PropsWithFormControl<RatingProps>>(
	({ name, label, value, ...rest }, ref) => {
		return (
			<FormControlLabel
				control={
					<>
						{/* alignment */}
						{/* &nbsp; &nbsp; */}
						<Wrapper
							name={name}
							aria-labelledby={name}
							ref={ref}
							value={Number(value)}
							{...rest}
						/>
						{/* alignment */}
						{/* &nbsp; &nbsp; */}
					</>
				}
				labelPlacement="top"
				label={label}
				style={{ alignItems: 'flex-start' }}
			/>
		);
	}
);

export default Rating;
