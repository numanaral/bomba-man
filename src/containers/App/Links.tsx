import config from 'config';
import { NavLink } from 'react-router-dom';
// import { NAV_LIST } from 'routes/pages-and-roles';
import styled from 'styled-components';
import theme from 'theme';

const Wrapper = styled.div`
	display: flex;
	justify-content: space-between;
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
	return (
		<Wrapper>
			<NavLink to="/">
				<LinkText>{config.title}</LinkText>
			</NavLink>
			<NavLink to="/profile">
				<LinkText>Profile</LinkText>
			</NavLink>
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
