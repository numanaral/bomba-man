import { TypographyProps } from '@material-ui/core';
import CenteredTypography from './CenteredTypography';

const H4: React.FC<TypographyProps> = ({ children, ...rest }) => {
	return (
		<CenteredTypography variant="body1" component="h4" {...rest}>
			{children}
		</CenteredTypography>
	);
};

export default H4;
