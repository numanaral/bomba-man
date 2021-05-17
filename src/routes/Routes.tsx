import { Redirect, Switch, useLocation } from 'react-router-dom';
import RouteWrapper from './RouteWrapper';
import { ROUTE_LIST } from './pages-and-roles';
import { BASE_PATH } from './constants';

const RedirectToNotFound = () => {
	const { pathname } = useLocation();
	return (
		<RouteWrapper
			exact
			path="*"
			component={
				<Redirect
					to={{
						pathname: `${BASE_PATH}/not-found`,
						state: {
							referrer: pathname,
						},
					}}
				/>
			}
		/>
	);
};

const Routes = (props: DynamicObject) => {
	// usePageView();
	return (
		<Switch>
			{ROUTE_LIST.map(({ component, path, ...rest }) => {
				return (
					<RouteWrapper
						key={path}
						path={path}
						component={component}
						exact
						{...rest}
						{...props}
					/>
				);
			})}
			<RedirectToNotFound />
		</Switch>
	);
};

export default Routes;
