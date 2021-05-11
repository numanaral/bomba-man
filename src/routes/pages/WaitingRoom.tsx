import PageContainer from 'components/PageContainer';
import { RouteComponentPropsWithLocationState } from 'routes/types';
import WaitingRoom from 'containers/WaitingRoom';
import { H1, H4 } from 'components/typography';
import theme from 'theme';

interface Props extends RouteComponentPropsWithLocationState<{ id: string }> {}

// TODO
const WaitingRoomPage = ({
	match: {
		params: { id },
	},
}: Props) => {
	return (
		<PageContainer>
			<H1> Waiting Room </H1>
			<H4>
				Room / Game Id:{' '}
				<span style={{ color: theme.palette.color.info }}>{id}</span>
			</H4>
			<WaitingRoom gameId={id} />
		</PageContainer>
	);
};

export default WaitingRoomPage;
