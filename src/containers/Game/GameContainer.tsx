import { makeSelectGameIs3D } from 'store/redux/reducers/game/selectors';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import config from 'config';

const SettingsAndMap = styled.div`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;

	& > :first-child {
		margin-right: 50px;
		width: 15%;
		@media only screen and (max-width: 600px) {
			width: 100%;
			margin: 50px auto;
			order: 2;
			& button {
				width: 80% !important;
			}
		}
	}
`;

const CenteredDiv = styled.div<{ $is3D: boolean }>`
	text-align: center;
	${({ $is3D }) => ($is3D && 'perspective: 1000') || ''}
`;

const GameContainer: React.FC = ({ children }) => {
	const is3D = useSelector(makeSelectGameIs3D());

	return (
		<CenteredDiv $is3D={is3D}>
			<h1>{config.title}</h1>
			<SettingsAndMap>{children}</SettingsAndMap>
		</CenteredDiv>
	);
};

export default GameContainer;
