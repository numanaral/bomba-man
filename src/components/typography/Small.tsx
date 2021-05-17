import { TypographyProps } from '@material-ui/core';
import CenteredTypography from './CenteredTypography';

const Small: React.FC<TypographyProps> = ({ children, ...rest }) => {
	return (
		<CenteredTypography variant="body2" component="small" {...rest}>
			{children}
		</CenteredTypography>
	);
};

export default Small;
