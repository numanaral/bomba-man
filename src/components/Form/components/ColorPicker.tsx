import { forwardRef } from 'react';
import { FormControlLabel } from '@material-ui/core';
import ColorPickerComponent, { ColorPickerProps } from 'components/ColorPicker';
import { TwitterPicker } from 'react-color';
import styled from 'styled-components';
import { PropsWithFormControl } from '../types';

const Wrapper = styled.div`
	margin-left: 13px;
`;

const ColorPicker = forwardRef<
	TwitterPicker,
	PropsWithFormControl<ColorPickerProps>
>(({ label, ...props }, ref) => (
	<FormControlLabel
		control={
			<Wrapper>
				<ColorPickerComponent ref={ref} {...props} />
			</Wrapper>
		}
		label={label}
	/>
));

export default ColorPicker;
