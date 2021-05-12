import { Link } from '@material-ui/core';
import ContainerWithCenteredItems from 'components/ContainerWithCenteredItems';
import PageContainer from 'components/PageContainer';
import { H1, H4 } from 'components/typography';
import { Link as NavLink } from 'react-router-dom';
import { RouteComponentPropsWithLocationState } from 'routes/types';

const NotFound = ({ location }: RouteComponentPropsWithLocationState) => {
	const referrer = location?.state?.referrer;
	return (
		<PageContainer fullHeight>
			<ContainerWithCenteredItems vertical>
				<H1>
					The page you were looking for is not found.
					{referrer && (
						<H4>
							<Link component={NavLink} to={referrer}>
								{referrer}
							</Link>
						</H4>
					)}
				</H1>
			</ContainerWithCenteredItems>
		</PageContainer>
	);
};

export default NotFound;
