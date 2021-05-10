import ContainerWithCenteredItems from 'components/ContainerWithCenteredItems';
import PageContainer from 'components/PageContainer';
import { H1 } from 'components/typography';

const NotFound = () => {
	return (
		<PageContainer fullHeight>
			<ContainerWithCenteredItems vertical>
				<H1>The page you were looking for is not found.</H1>
			</ContainerWithCenteredItems>
		</PageContainer>
	);
};

export default NotFound;
