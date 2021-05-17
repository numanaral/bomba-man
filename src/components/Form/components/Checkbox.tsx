import { forwardRef } from 'react';
import {
	FormControlLabel,
	Checkbox as MuiCheckbox,
	CheckboxProps,
} from '@material-ui/core';
import styled from 'styled-components';
import { PropsWithFormControl } from '../types';

const Wrapper = styled.div`
	margin-left: 13px;
`;

const Checkbox = forwardRef<
	HTMLButtonElement,
	PropsWithFormControl<CheckboxProps>
>(({ label, value, ...props }, ref) => {
	return (
		// TODO: Make this a reusable component
		<FormControlLabel
			control={
				<Wrapper>
					<MuiCheckbox
						color="primary"
						checked={!!value}
						value={value}
						ref={ref}
						{...props}
					/>
				</Wrapper>
			}
			label={label}
		/>
	);
});

export default Checkbox;
