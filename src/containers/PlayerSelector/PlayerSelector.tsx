import { GameType } from 'enums';
import PageContainer from 'components/PageContainer';
// import { FormContainer } from 'components/Form';
// import { Grid, GridSize } from '@material-ui/core';

// TODO
const PlayerSelector = ({ type }: { type: GameType }) => {
	console.log('type:', type);
	return (
		<PageContainer>
			PlayerSelector
			<br />
		</PageContainer>
	);
};

export default PlayerSelector;
