import PageContainer from 'components/PageContainer';
import RoomCreator from 'containers/RoomCreator';
import { GameType } from 'enums';
import { RouteComponentPropsWithLocationState } from 'routes/types';

const RoomCreatorPage = ({
	match: {
		params: { type },
	},
}: RouteComponentPropsWithLocationState<{ type: GameType }>) => {
	return (
		<PageContainer>
			<RoomCreator type={type} />
		</PageContainer>
	);
};

export default RoomCreatorPage;
