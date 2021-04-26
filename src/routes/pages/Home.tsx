import Container from 'components/Container';
import { NAV_LIST } from 'routes/pages-and-roles';
import styled from 'styled-components';
import LinkButton from 'components/LinkButton';
import { Fragment } from 'react';
import Spacer from 'components/Spacer';

const Menu = styled(Container)`
	flex-direction: column;
	& button {
		width: 200px;
	}
`;

const Home = () => {
	return (
		<Container>
			<Spacer direction="top" spacing="10" />
			<Menu>
				{NAV_LIST.filter(link => link.label !== 'Home').map(
					({ to, text }) => (
						<Fragment key={to}>
							<LinkButton to={to}>{text}</LinkButton>
							<Spacer direction="bottom" />
						</Fragment>
					)
				)}
			</Menu>
		</Container>
	);
};

export default Home;
