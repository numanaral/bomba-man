import { PlayerId } from 'containers/Game/types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { RouteComponentProps, StaticContext } from 'react-router';
import { GameConfig } from 'store/redux/reducers/game/types';

enum UserRoles {
	DEV = 'Developer',
	GENERIC_USER = 'User',
}

type Roles = Array<UserRoles>;

type Route = {
	title: string;
	description: string;
	path: string;
	component: ReactElementOrElementType;
	roles?: Roles;
};

type Link = {
	label: string;
	tooltip: string;
	text: string;
	to: string;
	icon?: JSX.Element | React.ComponentType;
};

type ReactRouterState = {
	/** Passed to /* */
	referrer?: string;
	/** Passed to /* */
	to?: string;
	/** Passed to /* */
	roles?: Roles;
	/** Passed to /local */
	gameConfig?: GameConfig;
	/** Passed to /unauthorized */
	message?: string;
	/** Passed to /online/:id */
	playerId?: PlayerId;
};

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
