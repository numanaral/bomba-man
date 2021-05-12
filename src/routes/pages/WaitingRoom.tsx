import PageContainer from 'components/PageContainer';
import { RouteComponentPropsWithLocationState } from 'routes/types';
import WaitingRoom from 'containers/WaitingRoom';
import { H1, H4 } from 'components/typography';
import theme from 'theme';
import Spacer from 'components/Spacer';

interface Props extends RouteComponentPropsWithLocationState<{ id: string }> {}

// TODO
const WaitingRoomPage = ({
	match: {
		params: { id },
	},
}: Props) => {
	const {
		location: { origin, pathname },
	} = window;
	const link = origin + pathname;
	return (
		<PageContainer>
			<H1> Waiting Room </H1>
			<Spacer />
			<H4>
				Room / Game Id:
				<br />
				<span style={{ color: theme.palette.color.info }}>{id}</span>
			</H4>
			<Spacer />
			<H4>
				Join Link:
				<br />
				<span style={{ color: theme.palette.color.info }}>{link}</span>
			</H4>
			<WaitingRoom gameId={id} />
		</PageContainer>
	);
};

export default WaitingRoomPage;
