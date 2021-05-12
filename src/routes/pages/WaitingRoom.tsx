import PageContainer from 'components/PageContainer';
import { RouteComponentPropsWithLocationState } from 'routes/types';
import WaitingRoom from 'containers/WaitingRoom';

interface Props extends RouteComponentPropsWithLocationState<{ id: string }> {}

// TODO
const WaitingRoomPage = ({
	match: {
		params: { id },
	},
}: Props) => {
	return (
		<PageContainer style={{ overflow: 'hidden' }}>
			<WaitingRoom gameId={id} />
		</PageContainer>
	);
};

export default WaitingRoomPage;
