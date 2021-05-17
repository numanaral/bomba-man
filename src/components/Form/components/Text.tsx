import styled from 'styled-components';
import { TextField, TextFieldProps } from '@material-ui/core';
import { forwardRef } from 'react';

const Wrapper = styled(TextField)`
	${({ theme }) => `
		margin-bottom: ${theme.spacing(2)}px;
	`}
`;

const Text = forwardRef<HTMLInputElement, TextFieldProps>(
	({ variant = 'outlined', helperText, ...props }, ref) => {
		return (
			<Wrapper
				variant={variant}
				inputRef={ref}
				error={!!helperText}
				helperText={helperText}
				{...props}
			/>
		);
	}
);

export default Text;
