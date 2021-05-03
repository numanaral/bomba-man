import styled from 'styled-components';
import { PickedGameState } from './types';

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

interface Props extends PickedGameState<'is3D'> {}

const GameContainer: React.FC<Props> = ({ children, is3D }) => {
	return (
		<CenteredDiv $is3D={is3D}>
			<h1>Bomba-man - Work In Progress</h1>
			<SettingsAndMap>{children}</SettingsAndMap>
		</CenteredDiv>
	);
};

export type { Props as GameContainerProps };
export default GameContainer;
