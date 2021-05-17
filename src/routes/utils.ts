import { BASE_PATH } from './constants';
import { Roles, Route, Link } from './types';

const mapRoles = (roles: Roles) => (route: Route | Link) => ({
	...route,
	roles,
});

const mapBasePathForRoutes = (route: Route) => ({
	...route,
	...(route.path !== '/' && { path: BASE_PATH + route.path }),
});

const mapBasePathForLinks = (link: Link) => ({
	...link,
	...(link.to && { to: BASE_PATH + link.to }),
});

const mapRouteToLink = ({ title, path }: Route) => {
	return {
		label: title,
		tooltip: title,
		text: title,
		to: path,
	} as Link;
};

/**
 * Returns true if at least one source value is contained in the
 * from array
 *
 * @example
 * ```ts
 * // Does user have any roles that match access roles?
 * const userRoles = ['A'];
 * const canAccessRoles = ['A', 'B'];
 * hasAnyFrom(canAccessRoles, userRoles) === true // true
 * ```
 *
 * @param source - List to match at least 1 element with
 * @param list - List to check if the element exists
 */
const hasAnyFrom = (source: Roles, from: Roles) => {
	return source?.length === 0 || source.some(e => from.indexOf(e) >= 0);
};

export {
	mapRoles,
	mapBasePathForRoutes,
	mapBasePathForLinks,
	mapRouteToLink,
	hasAnyFrom,
};
