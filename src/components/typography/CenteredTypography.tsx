import { Typography } from '@material-ui/core';
import styled from 'styled-components';

const CenteredTypography = styled(Typography)<{
	// BUG: gotta override here
	component: React.ElementType;
}>`
	text-align: center;
`;

export default CenteredTypography;
