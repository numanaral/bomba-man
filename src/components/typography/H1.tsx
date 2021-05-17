import { TypographyProps } from '@material-ui/core';
import CenteredTypography from './CenteredTypography';

const H1: React.FC<TypographyProps> = ({ children, ...rest }) => {
	return (
		<CenteredTypography variant="h4" component="h1" {...rest}>
			{children}
		</CenteredTypography>
	);
};

export default H1;
