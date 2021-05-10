import PageContainer from 'components/PageContainer';
import { H1 } from 'components/typography';
import theme from 'theme';
import styled from 'styled-components';
import Spacer from 'components/Spacer';

const H1Wrapper = styled(H1)`
	color: ${theme.palette.color.error};
`;

const NoAccess: React.FC = ({ children }) => (
	<PageContainer fullHeight>
		<Spacer spacing="5" />
		<H1Wrapper>
			Either the game is not found or you don&apos;t have access to it.
		</H1Wrapper>
		<Spacer spacing="10" />
		{children}
	</PageContainer>
);

export default NoAccess;
