import PageContainer from 'components/PageContainer';
import RoomCreator from 'containers/RoomCreator';
import { RoomType } from 'enums';
import { RouteComponentPropsWithLocationState } from 'routes/types';

const RoomCreatorPage = ({
	match: {
		params: { type },
	},
}: RouteComponentPropsWithLocationState<{ type: RoomType }>) => {
	return (
		<PageContainer>
			<RoomCreator type={type} />
		</PageContainer>
	);
};

export default RoomCreatorPage;
