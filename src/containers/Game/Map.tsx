import styled from 'styled-components';
import theme from 'theme';

const Map = styled.div`
	width: 800px;
	height: 500px;
	border-radius: ${theme.shape.borderRadius};
	background-color: ${theme.palette.background.secondary};
`;

// const Map = () => {
// 	return (
// 		<div>
// 			<p>Map</p>
// 		</div>
// 	);
// };

export default Map;
