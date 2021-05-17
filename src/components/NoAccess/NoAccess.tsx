import PageContainer from 'components/PageContainer';
import { H1 } from 'components/typography';
import theme from 'theme';
import styled from 'styled-components';
import Spacer from 'components/Spacer';

const H1Wrapper = styled(H1)`
	color: ${theme.palette.color.error};
`;

interface Props {
	message?: string;
}

const DEFAULT_ERROR_MESSAGE =
	"Either the game is not found or you don't have access to it.";
const NoAccess: React.FC<Props> = ({
	children,
	message = DEFAULT_ERROR_MESSAGE,
}) => (
	<PageContainer>
		<Spacer spacing="5" />
		<H1Wrapper>{message}</H1Wrapper>
		<Spacer spacing="10" />
		{children}
	</PageContainer>
);

export default NoAccess;
