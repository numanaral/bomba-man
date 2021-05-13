import { GameType } from 'enums';
import { Redirect } from 'react-router-dom';
import loadable from 'utils/loadable';
import { BASE_PATH } from './constants';
import {
	UserRoles,
	Route,
	Link,
	RouteComponentPropsWithLocationState,
} from './types';
import {
	mapRoles,
	mapBasePathForRoutes,
	mapBasePathForLinks,
	// mapRouteToLink,
} from './utils';

const PAGE_ROLES = {
	// PUBLIC: '*',
	DEV: [UserRoles.DEV],
	LOGGED_IN: [UserRoles.DEV, UserRoles.GENERIC_USER],
};

/* eslint-disable prettier/prettier */
// Public routes
const LazyHome = loadable(() => import(`routes/pages/Home`));
const LazyLocal = loadable(() => import(`routes/pages/Local`));
const LazyInstructions = loadable(() => import(`routes/pages/Instructions`));
const LazyGameEnd = loadable(() => import(`routes/pages/GameEnd`));
const LazyRoomCreator = loadable<RouteComponentPropsWithLocationState<{ type: GameType }>>(() => import(`routes/pages/RoomCreator`));
const LazyOnline = loadable<RouteComponentPropsWithLocationState<{id: string}>>(() => import(`routes/pages/Online`));
const LazyJoin = loadable(() => import(`routes/pages/Join`));
const LazyWaitingRoom = loadable<RouteComponentPropsWithLocationState<{id: string}>>(() => import(`routes/pages/WaitingRoom`));

// Private routes
const LazyProfile = loadable(() => import(`routes/pages/Profile`));

// Handler Pages
const LazyNotFound = loadable(() => import(`./pages/NotFound`));
const LazyUnauthorized = loadable(() => import(`./pages/Unauthorized`));
const LazyLogin = loadable(() => import(`./pages/Login`));
const LazySignUp = loadable(() => import(`./pages/SignUp`));
/* eslint-enable prettier/prettier */

const PRIVATE_ROUTES = [
	{
		title: 'Profile',
		description: `Adjust your app profile.`,
		path: '/profile',
		component: LazyProfile,
	},
].map(mapRoles(PAGE_ROLES.LOGGED_IN)) as Array<Route>;

const ROUTE_LIST = [
	{
		title: 'Home | Bomba-man',
		description: `Welcome to the bomberman, here you can find settings and create a room to play online with friends`,
		path: '',
		component: LazyHome,
	},
	{
		path: '/',
		component: <Redirect to={BASE_PATH} />,
	} as Route,
	...PRIVATE_ROUTES,
	// TODO make online version private
	{
		title: 'Room Creator',
		description: `Build a room to play with friends online.`,
		path: '/room-creator/:type',
		component: LazyRoomCreator,
	},
	{
		title: 'Local Game',
		description: `Local game, multiplayer and/or with NPCs.`,
		path: '/local',
		component: LazyLocal,
	},
	{
		title: 'Online Multiplayer',
		description: `Invite friends to play alongside you in this room.`,
		path: '/online/:id',
		component: LazyOnline,
	},
	{
		title: 'Waiting Room',
		description: `Waiting for your friends to join before the game starts.`,
		path: '/waiting-room/:id',
		component: LazyWaitingRoom,
	},
	{
		title: 'Join a Game',
		description: `Join a game room to play with your friend.`,
		path: '/join',
		component: LazyJoin,
	},
	{
		title: 'Instructions',
		description: `How to play.`,
		path: '/instructions',
		component: LazyInstructions,
	},
	{
		title: 'End Game',
		description: `Game has ended.`,
		path: '/game-end',
		component: LazyGameEnd,
	},
	{
		title: 'Login',
		description: `Login to the app.`,
		path: '/login',
		component: <LazyLogin authorizing={false} />,
	},
	{
		title: 'SignUp',
		description: `Sign up for an account.`,
		path: '/signup',
		component: LazySignUp,
	},
	{
		title: 'Unauthorized',
		description: `User does not have access to the following page.`,
		path: '/unauthorized',
		component: LazyUnauthorized,
	},
	{
		title: 'Not Found',
		description: `The page you are looking for might have been removed had its name changed or is temporarily unavailable.`,
		path: '/not-found',
		component: LazyNotFound,
	},
].map(mapBasePathForRoutes);

// const MENU_PAGES = [];

const SHARED_DISPLAY_PAGES = ([
	// Public Paths
	...[
		{
			label: 'Home',
			tooltip: `Landing Page`,
			text: 'Home', // remove this once the logo is added
			to: '/',
			// icon: HomeIcon
		} as Link,
		{
			label: 'Local Game',
			tooltip: 'Local Game',
			text: 'Local Game',
			to: '/room-creator/local',
		},
		{
			label: 'Create Online Game',
			tooltip: 'Create Online Game',
			text: 'Create Online Game',
			to: '/room-creator/online',
		},
		{
			label: 'Join Online Game',
			tooltip: 'Join Online Game',
			text: 'Join Online Game',
			to: '/join',
		},
		{
			label: 'Instructions',
			tooltip: 'Instructions',
			text: 'Instructions',
			to: '/instructions',
		},
	],
	// Private Paths
	// ...PRIVATE_ROUTES.filter(({ path }) => path !== '/profile')
	// 	.map(mapRouteToLink)
	// 	.map(mapRoles(PAGE_ROLES.LOGGED_IN)),
] as Array<Link>).map(mapBasePathForLinks);

const NAV_LIST = [...SHARED_DISPLAY_PAGES];

const NAV_LIST_MOBILE = [...SHARED_DISPLAY_PAGES].map(mapBasePathForLinks);

export { UserRoles, ROUTE_LIST, NAV_LIST, NAV_LIST_MOBILE };
