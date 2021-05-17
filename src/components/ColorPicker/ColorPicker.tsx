import { forwardRef } from 'react';
import styled from 'styled-components';
import { TwitterPicker } from 'react-color';
import Popover from 'components/Popover';
import { CheckBoxOutlineBlank as CheckboxIcon } from '@material-ui/icons';
import TooltipButton from 'components/TooltipButton';
import theme from 'theme';

const ColoredIcon = styled(CheckboxIcon)<{ $bg?: string }>`
	margin-left: -2px;
	width: 20px;
	height: 20px;
	${({ $bg }) => {
		if (!$bg) return '';
		return `
			fill: ${$bg} !important;
			border-radius: ${theme.shape.borderRadius};
			color: ${$bg} !important;
			background-color: ${$bg} !important;
		`;
	}}
`;

interface Props {
	value: string;
	onChange: (hexColor: string) => void;
}

const ColorPicker = forwardRef<TwitterPicker, Props>(
	({ value, onChange, ...rest }, ref) => {
		// console.log('{ value, onChange, ...rest }:', {
		// 	value,
		// 	onChange,
		// 	...rest,
		// });
		return (
			<Popover
				buttonComponent={
					<TooltipButton
						tooltip="Pick a color"
						icon={<ColoredIcon fontSize="small" $bg={value} />}
					/>
				}
				component={
					<TwitterPicker
						colors={
							Object.values(theme.palette.color)
							// '#FCB900',
							// '#7BDCB5',
							// '#00D084',
							// '#8ED1FC',
							// '#0693E3',
							// '#ABB8C3',
							// '#EB144C',
							// '#F78DA7',
							// '#9900EF',
						}
						color={value}
						onChangeComplete={colors => {
							onChange(colors.hex);
						}}
						ref={ref}
						{...rest}
					/>
				}
			/>
		);
	}
);

export type { Props as ColorPickerProps };
export default ColorPicker;
