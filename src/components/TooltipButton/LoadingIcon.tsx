import { CircularProgress } from '@material-ui/core';
import styled from 'styled-components';

const StyledDiv = styled.div`
	justify-content: center;
	align-items: center;
	display: flex;
	vertical-align: middle;
`;

const LoadingIndicator = ({ size = 'medium', ...rest }) => {
	let iconSize = 40;
	if (size === 'small') iconSize = 20;
	else if (size === 'large') iconSize = 80;

	return (
		<StyledDiv>
			<CircularProgress size={iconSize} {...rest} />
		</StyledDiv>
	);
};

export default LoadingIndicator;
