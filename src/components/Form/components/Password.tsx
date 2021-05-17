import { TextFieldProps } from '@material-ui/core';
import { forwardRef } from 'react';
import Text from './Text';

const Password = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => (
	<Text {...props} type="password" ref={ref} />
));

export default Password;
