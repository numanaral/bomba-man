import { RoomType } from 'enums';
import PageContainer from 'components/PageContainer';
// import { FormContainer } from 'components/Form';
// import { Grid, GridSize } from '@material-ui/core';

// TODO
const WaitingRoom = ({ type }: { type: RoomType }) => {
	console.log('type:', type);
	return (
		<PageContainer>
			WaitingRoom
			<br />
		</PageContainer>
	);
};

export default WaitingRoom;
