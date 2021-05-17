import NoAccess from 'components/NoAccess';
import { RouteComponentPropsWithLocationState } from 'routes/types';

const Unauthorized = ({ location }: RouteComponentPropsWithLocationState) => {
	const message = location?.state?.message;
	return <NoAccess message={message} />;
};

export default Unauthorized;
