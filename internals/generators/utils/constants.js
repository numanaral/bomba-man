// These types will be used for template folder names as a fallback
const TEMPLATE_TYPES = {
	COMPONENT: 'component',
	CONTAINER: 'container',
	PROVIDER: 'provider',
	HOOK: 'hook',
	REGULAR_HOOK: 'regular-hook',
	REDUX_HOOK: 'redux-hook',
	FIREBASE_HOOK: 'firebase-hook',
};
const {
	COMPONENT,
	CONTAINER,
	PROVIDER,
	HOOK,
	REGULAR_HOOK,
	REDUX_HOOK,
	FIREBASE_HOOK,
} = TEMPLATE_TYPES;

// Path that comes after **/src/, i.e. **/src/components
const TYPE_POST_SRC_PATHS = {
	[COMPONENT]: 'components',
	[CONTAINER]: 'containers',
	[PROVIDER]: 'providers',
	[HOOK]: 'hooks',
	[REGULAR_HOOK]: 'hooks',
	[REDUX_HOOK]: 'store/redux/hooks',
	[FIREBASE_HOOK]: 'store/firebase/hooks',
};

// If you name the folders differently, override it here
const TEMPLATE_FOLDER_NAMES = {
	// [SOME_TYPE]: 'some-custom-folder-name',
	[REGULAR_HOOK]: 'hooks',
	[REDUX_HOOK]: 'hooks',
	[FIREBASE_HOOK]: 'hooks',
};

// Plop prop, aborts the process if an action fails
const ABORT_ON_FAIL = {
	abortOnFail: true,
};

// Plop prop, allows action to create a physical file in the system
const ADD_ACTION_TYPE = {
	type: 'add',
};

const generateType = type => ({ type });
const PROMPT_TYPES = {
	// Included
	INPUT: generateType('input'),
	NUMBER: generateType('number'),
	PASSWORD: generateType('password'),
	LIST: generateType('list'),
	RAW_LIST: generateType('rawList'),
	EXPAND: generateType('expand'),
	CHECKBOX: generateType('checkbox'),
	CONFIRM: generateType('confirm'),
	EDITOR: generateType('editor'),
	// Custom
	STRING_TO_LIST: generateType('stringToList'),
};

module.exports = {
	TEMPLATE_TYPES,
	TYPE_POST_SRC_PATHS,
	TEMPLATE_FOLDER_NAMES,
	ABORT_ON_FAIL,
	ADD_ACTION_TYPE,
	PROMPT_TYPES,
};
