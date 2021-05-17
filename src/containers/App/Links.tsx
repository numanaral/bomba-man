import config from 'config';
import { NavLink, useLocation } from 'react-router-dom';
// import { BASE_PATH } from 'routes/constants';
// import { NAV_LIST } from 'routes/pages-and-roles';
import styled from 'styled-components';
import theme from 'theme';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FontAwesomeIconProps } from 'containers/Game/types';
import { BASE_PATH } from 'routes/constants';
import Spacer from 'components/Spacer';

const HomeIcon = (props: FontAwesomeIconProps) => (
	<FontAwesomeIcon icon={faHome} {...props} />
);

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
`;

const LinkText = styled.h1`
	color: ${theme.palette.color.info};
	margin: 0;
	padding: 10px 15px;
	transition: color ${theme.transition.hover};
	display: inline-block;

	&:hover {
		color: ${theme.palette.color['info-lighter']};
	}
`;

const Links = () => {
	const { pathname } = useLocation();
	const localHomePath = `${BASE_PATH}`;
	const isHomePage =
		pathname === localHomePath || pathname === `${localHomePath}/`;
	return (
		<Wrapper id="site-navbar">
			{isHomePage ? (
				<Spacer spacing="7" />
			) : (
				<NavLink to="/">
					<LinkText>
						<HomeIcon /> {config.title}
					</LinkText>
				</NavLink>
			)}
			{/* TODO: grab paths from the constants, or create enum? */}
			{/* <NavLink to={`${BASE_PATH}/profile`}>
				<LinkText>Profile</LinkText>
			</NavLink> */}
		</Wrapper>
	);
	// return (
	// 	<L>
	// 		{NAV_LIST.filter(link => link.label !== 'Home').map(link => (
	// 			<NavLink
	// 				// color="textPrimary"
	// 				activeClassName="active"
	// 				// activeStyle={{
	// 				// 	fontWeight: 'bold',
	// 				// 	color: 'red',
	// 				// }}
	// 				key={link.to}
	// 				to={link.to}
	// 			>
	// 				{link.text}
	// 			</NavLink>
	// 		))}
	// 	</NavLink>
	// );
};

export default Links;
