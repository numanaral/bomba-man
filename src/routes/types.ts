// eslint-disable-next-line import/no-extraneous-dependencies
import { RouteComponentProps, StaticContext } from 'react-router';

enum UserRoles {
	DEV = 'Developer',
	GENERIC_USER = 'User',
}

type Roles = Array<UserRoles>;

type Route = {
	title: string;
	description: string;
	path: string;
	component: JSX.Element;
	roles?: Roles;
};

type Link = {
	label: string;
	tooltip: string;
	text: string;
	to: string;
	icon?: JSX.Element | React.ComponentType;
};

type ReactRouterState = { referrer?: string; to?: string; roles?: Roles };

type RouteComponentPropsWithLocationState<
	Params extends { [K in keyof Params]?: string } = {},
	C extends StaticContext = StaticContext
> = RouteComponentProps<Params, C, ReactRouterState> & {
	error?: string;
};

export type {
	StaticContext,
	RouteComponentPropsWithLocationState,
	ReactRouterState,
	Roles,
	Route,
	Link,
};
export { UserRoles };