import { cloneElement } from 'react';
import Helmet from 'react-helmet';
import { Route, useHistory, useLocation } from 'react-router-dom';

import ErrorBoundary from 'components/ErrorBoundary';
import loadable from 'utils/loadable';
// import useAuth from 'store/firebase/hooks/useAuth';
// import useProfile from 'store/firebase/hooks/useProfile';
import { getElementFromElementOrType } from 'utils/react';
import { hasAnyFrom } from './utils';
import { BASE_PATH } from './constants';
import {
	RouteComponentPropsWithLocationState,
	ReactRouterState,
	Roles,
	UserRoles,
} from './types';
import { LoginProps } from './pages/Login';

const LazyUnauthorized = loadable<RouteComponentPropsWithLocationState>(
	() => import('./pages/Unauthorized')
);
const LazyLogin = loadable<RouteComponentPropsWithLocationState & LoginProps>(
	() => import('./pages/Login')
);

// interface Props<P, C extends StaticContext = StaticContext>
// 	extends Route<RouteComponentPropsWithLocationState> {
// 	component:
// 		| React.FunctionComponent
// 		| React.ReactElement<
// 				RouteComponentPropsWithLocationState<P, C>,
// 				string | React.JSXElementConstructor<any>
// 		  >;
// 	roles: Roles;
// 	title: string;
// 	description: string;
// }

// @ts-expect-error
interface Props extends React.ComponentProps<typeof Route> {
	component: ReactElementOrElementType;
	roles?: Roles;
	title?: string;
	description?: string;
}

/**
 * LOGIC:
 * - If the requested path requires roles and app is fetching the user data from the login request
 * 	- Redirect to Login w/o error
 * 	- This triggers a loading screen with the message "Authorizing"
 * - If the user is not logged in (userName === '')
 * 	- If the requested path requires roles and we are not back at the /login
 * 		- Redirect to login with returnUrl
 * 	- If the path is /login
 * 		- If there was a user error or referrer requires roles and the user is not logged in
 * 			- Redirect to login w/ error message asking user to log in
 * - If requested path requires roles
 * 	- If user is trying to access '/login' or '/unauthorized'
 * 		- Redirect back to '/' (root)
 * 	- If user doesn't have the required roles
 * 		- Redirect to Unauthorized
 * - Else access the path
 */
const RouteWrapper = ({
	component: Component,
	roles = [],
	title,
	description,
	...rest
}: Props) => {
	// const { isAuthorizing, user } = useAuth();
	// const {
	// isAuthorizing: isAuthorizingProfile,
	// roles: userRoles,
	// } = useProfile();

	const isAuthorizing = false;
	const user = { displayName: 'Temp User', email: '' };
	const isAuthorizingProfile = false;
	const userRoles: Roles = [UserRoles.GENERIC_USER];

	const userName = user?.displayName || user?.email;
	// const userAuthError = '';

	const _isAuthorizing = isAuthorizing || isAuthorizingProfile;

	const {
		push,
		location: { state, search },
	} = useHistory<ReactRouterState>();
	const { pathname } = useLocation();
	const referrerRoles = state?.roles || [];

	const isAuthRequiredForTheCurrentPage = !!roles.length;
	const isAuthRequiredForTheReferrerPage = !!referrerRoles.length;
	const requiredRoles =
		(isAuthRequiredForTheCurrentPage && roles) || referrerRoles;
	const isAuthRequired =
		isAuthRequiredForTheCurrentPage || isAuthRequiredForTheReferrerPage;

	// @ts-expect-error
	const render: React.ComponentProps<typeof Route>['render'] = (
		renderProps: RouteComponentPropsWithLocationState
	) => {
		// Redirect to Authorizing via Login when auth is taking place
		if (isAuthRequiredForTheCurrentPage && _isAuthorizing) {
			return <LazyLogin {...renderProps} authorizing />;
		}

		// If user is not logged in and auth is required
		if (!userName && isAuthRequired && pathname !== `${BASE_PATH}/login`) {
			push(`${BASE_PATH}/login?returnUrl=${pathname}`, { roles });
		}

		// If logged in and
		if (userName) {
			const returnUrl = (search || '').replace('?returnUrl=', '');

			if (returnUrl) {
				push(returnUrl);
			} else if (
				// If logged in, don't allow to /login or /unauthorized directly
				pathname === `${BASE_PATH}/signup` ||
				pathname === `${BASE_PATH}/login`
				// pathname === `${BASE_PATH}/unauthorized`
			) {
				// Redirect back to home
				push(`${BASE_PATH}/`);
			} else if (!hasAnyFrom(requiredRoles, userRoles)) {
				return <LazyUnauthorized {...renderProps} />;
			}
		}

		return (
			<>
				{title && (
					<Helmet>
						<title>{title}</title>
						<meta name="description" content={description} />
					</Helmet>
				)}
				{cloneElement<RouteComponentPropsWithLocationState>(
					// eslint-disable-next-line max-len
					getElementFromElementOrType<RouteComponentPropsWithLocationState>(
						Component
					),
					{
						...renderProps,
					}
				)}
			</>
		);
	};

	return (
		<ErrorBoundary>
			<Route render={render} {...rest} />
		</ErrorBoundary>
	);
};

export default RouteWrapper;
