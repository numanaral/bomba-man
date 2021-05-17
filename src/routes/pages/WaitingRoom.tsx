import { RouteComponentPropsWithLocationState } from 'routes/types';
import WaitingRoom from 'containers/WaitingRoom';

interface Props extends RouteComponentPropsWithLocationState<{ id: string }> {}

// TODO
const WaitingRoomPage = ({
	match: {
		params: { id },
	},
}: Props) => {
	return <WaitingRoom gameId={id} />;
};

export default WaitingRoomPage;
