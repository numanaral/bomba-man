import Container from 'components/Container';
import { NAV_LIST } from 'routes/pages-and-roles';
import styled from 'styled-components';
import LinkButton from 'components/LinkButton';
import { Fragment } from 'react';
import Spacer from 'components/Spacer';
import SpriteCharacter from 'containers/Game/components/SpriteCharacter';

const CharacterWrapper = styled.div`
	position: relative;
	width: 100%;
	height: 100px;

	& > div {
		transform: scale(4);
		/* Gotta override as char is taking coordinates by default */
		top: 32px !important;
		left: calc(50% - 32px / 2) !important;
	}
`;

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
			<CharacterWrapper>
				<SpriteCharacter
					coordinates={{ top: 0, left: 0 }}
					id="P1"
					name="Bomba-man"
					isWalking
				/>
			</CharacterWrapper>
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
