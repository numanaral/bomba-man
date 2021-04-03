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
		// Generate index.tsx
		const actions = [
			{
				path: '../../src/providers/{{properCase name}}.tsx',
				templateFileName: `provider.tsx.hbs`,
			},
			{
				outputFileName: '../../src/providers/index.tsx',
				templateFileName: `index.tsx.hbs`,
			},
		];

		// If they want actions and a reducer, generate actions.tsx, constants.tsx,
		// reducer.tsx
		if (data.wantActionsAndReducer) {
			// Actions
			actions.push({
				outputFileName: '../../src/providers/actions.tsx',
				templateFileName: `actions.tsx.hbs`,
			});

			// Constants
			actions.push({
				outputFileName: '../../src/providers/constants.tsx',
				templateFileName: `constants.tsx.hbs`,
			});

			// Selectors
			actions.push({
				outputFileName: '../../src/providers/selectors.tsx',
				templateFileName: `selectors.tsx.hbs`,
			});

			// Reducer
			actions.push({
				outputFileName: '../../src/providers/reducer.tsx',
				templateFileName: `reducer.tsx.hbs`,
			});
		}

		// Thunks
		if (data.wantAsync) {
			actions.push({
				outputFileName: '../../src/providers/thunks.tsx',
				templateFileName: `thunks.tsx.hbs`,
			});
		}

		actions.push({
			type: 'prettify',
			path: '/providers/',
		});

		return actions;
	},
};
