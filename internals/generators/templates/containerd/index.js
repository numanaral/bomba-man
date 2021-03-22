const { TEMPLATE_TYPES, PRETTIFY } = require('../../utils/constants');
const {
	getCreatePath,
	conditionalAdd,
	validate,
	mapAbortOnFail,
} = require('../../utils');

const TEMPLATE_TYPE = TEMPLATE_TYPES.CONTAINER;
const CREATE_PATH = getCreatePath(TEMPLATE_TYPE);

module.exports = {
	description: 'Add a container component',
	prompts: [
		{
			type: 'input',
			name: 'name',
			message: 'What should it be called?',
			default: 'Form',
			validate: validate(TEMPLATE_TYPE),
		},
		{
			type: 'confirm',
			name: 'memo',
			default: false,
			message: 'Do you want to wrap your component in React.memo?',
		},
		{
			type: 'confirm',
			name: 'wantHeaders',
			default: false,
			message: 'Do you want headers?',
		},
		{
			type: 'confirm',
			name: 'wantActionsAndReducer',
			default: true,
			message:
				'Do you want an actions/constants/selectors/reducer tuple for this container?',
		},
		{
			type: 'input',
			name: 'defaultStateName',
			message:
				'Enter a default state name for default constants/reducer key (i.e. SET_STATENAME, { statename: "someValue" })',
			default: 'state',
			validate: value => {
				if (/.+/.test(value)) return true;

				return 'The name is required';
			},
		},
		{
			type: 'confirm',
			name: 'wantPersistedReducer',
			default: false,
			message: 'Do you want reducer to be persisted?',
		},
		{
			type: 'confirm',
			name: 'wantAsync',
			default: true,
			message: 'Do you want asynchronous flows? (e.g. fetching data)',
		},
		{
			type: 'confirm',
			name: 'wantLoadable',
			default: true,
			message: 'Do you want a lazy loadable component?',
		},
	],
	actions: data => {
		// Generate index.js and index.test.js
		const actions = [
			{
				outputFileName: '../../src/containers/{{properCase name}}.js',
				templateFileName: `container.js.hbs`,
			},
			{
				outputFileName: '../../src/containers/index.js',
				templateFileName: `index.js.hbs`,
			},
			{
				outputFileName: '../../src/containers/tests/index.test.js',
				templateFileName: `test.js.hbs`,
			},
		];

		// If they want actions and a reducer, generate actions.js, constants.js,
		// reducer.js and the corresponding tests for actions and the reducer
		if (data.wantActionsAndReducer) {
			// Actions
			actions.push({
				outputFileName: '../../src/containers/actions.js',
				templateFileName: `actions.js.hbs`,
			});
			actions.push({
				outputFileName: '../../src/containers/tests/actions.test.js',
				templateFileName: `actions.test.js.hbs`,
			});

			// Constants
			actions.push({
				outputFileName: '../../src/containers/constants.js',
				templateFileName: `constants.js.hbs`,
			});

			// Selectors
			actions.push({
				outputFileName: '../../src/containers/selectors.js',
				templateFileName: `selectors.js.hbs`,
			});
			actions.push({
				outputFileName: '../../src/containers/tests/selectors.test.js',
				templateFileName: `selectors.test.js.hbs`,
			});

			// Reducer
			actions.push({
				outputFileName: '../../src/containers/reducer.js',
				templateFileName: `reducer.js.hbs`,
			});
			actions.push({
				outputFileName: '../../src/containers/tests/reducer.test.js',
				templateFileName: `reducer.test.js.hbs`,
			});
		}

		// Thunks
		if (data.wantAsync) {
			actions.push({
				outputFileName: '../../src/containers/thunks.js',
				templateFileName: `thunks.js.hbs`,
			});
			// actions.push({
			// 	type: 'add',
			// 	outputFileName: '../../src/containers/tests/thunks.test.js',
				templateFileName: `thunks.test.js.hbs`,
			// 	...ABORT_ON_FAIL,
			// });
		}

		if (data.wantLoadable) {
			actions.push({
				outputFileName: '../../src/containers/Lazy.js',
				templateFileName: `loadable.js.hbs`,
			});
		}

		actions.push({
			type: 'prettify',
			path: '/containers/',
		});

		return actions;
	},
};
