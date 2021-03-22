const { TEMPLATE_TYPES, PRETTIFY } = require('../../utils/constants');
const {
	getCreatePath,
	conditionalAdd,
	validate,
	mapAbortOnFail,
} = require('../../utils');

const TEMPLATE_TYPE = TEMPLATE_TYPES.PROVIDER;
const CREATE_PATH = getCreatePath(TEMPLATE_TYPE);

module.exports = {
	description: 'Add a provider component',
	prompts: [
		{
			type: 'input',
			name: 'name',
			message: 'What should it be called?',
			default: 'Form',
			// validate: validate(TEMPLATE_TYPE),
		},
		{
			type: 'confirm',
			name: 'wantActionsAndReducer',
			default: true,
			message:
				'Do you want an actions/constants/selectors/reducer tuple for this provider?',
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
	],
	actions: data => {
		// Generate index.js and index.test.js
		const actions = [
			{
				path: '../../src/providers/{{properCase name}}.js',
				templateFileName: `provider.js.hbs`,
			},
			{
				outputFileName: '../../src/providers/index.js',
				templateFileName: `index.js.hbs`,
			},
			{
				path: '../../src/providers/tests/index.test.js',
				templateFileName: `test.js.hbs`,
			},
		];

		// If they want actions and a reducer, generate actions.js, constants.js,
		// reducer.js and the corresponding tests for actions and the reducer
		if (data.wantActionsAndReducer) {
			// Actions
			actions.push({
				outputFileName: '../../src/providers/actions.js',
				templateFileName: `actions.js.hbs`,
			});
			actions.push({
				path: '../../src/providers/tests/actions.test.js',
				templateFileName: `actions.test.js.hbs`,
			});

			// Constants
			actions.push({
				outputFileName: '../../src/providers/constants.js',
				templateFileName: `constants.js.hbs`,
			});

			// Selectors
			actions.push({
				outputFileName: '../../src/providers/selectors.js',
				templateFileName: `selectors.js.hbs`,
			});
			actions.push({
				path: '../../src/providers/tests/selectors.test.js',
				templateFileName: `selectors.test.js.hbs`,
			});

			// Reducer
			actions.push({
				outputFileName: '../../src/providers/reducer.js',
				templateFileName: `reducer.js.hbs`,
			});
			actions.push({
				path: '../../src/providers/tests/reducer.test.js',
				templateFileName: `reducer.test.js.hbs`,
			});
		}

		// Thunks
		if (data.wantAsync) {
			actions.push({
				outputFileName: '../../src/providers/thunks.js',
				templateFileName: `thunks.js.hbs`,
			});
			actions.push({
				path: '../../src/providers/tests/thunks.test.js',
				templateFileName: `thunks.test.js.hbs`,
			});
		}

		actions.push({
			type: 'prettify',
			path: '/providers/',
		});

		return actions;
	},
};
