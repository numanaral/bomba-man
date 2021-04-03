const { TEMPLATE_TYPES, PROMPT_TYPES } = require('../../utils/constants');
const {
	conditionalAdd,
	prefixProperCase,
	validate,
	generateActions,
} = require('../../utils');

const { INPUT, LIST, STRING_TO_LIST } = PROMPT_TYPES;
const { REGULAR_HOOK, REDUX_HOOK, FIREBASE_HOOK } = TEMPLATE_TYPES;

const prefixHook = input => prefixProperCase('use', input);

/** @type {import('node-plop/types/index').PlopGeneratorConfig} */
module.exports = {
	description: 'Add an unconnected component',
	prompts: async inquirer => {
		const { type } = await inquirer.prompt([
			{
				...LIST,
				name: 'type',
				message: 'What kind of hook do you want?',
				choices: [
					{
						name: 'Regular',
						value: REGULAR_HOOK,
						key: '1',
						checked: true,
					},
					{
						name: 'Redux',
						value: REDUX_HOOK,
						key: '2',
					},
					{
						name: 'Firebase',
						value: FIREBASE_HOOK,
						key: '3',
					},
				],
			},
		]);

		const whenReduxHook = {
			when: type === REDUX_HOOK,
		};

		const { name, ...rest } = await inquirer.prompt([
			{
				...INPUT,
				name: 'name',
				message: 'What should it be called? (without the word -use-)',
				transformer: prefixHook,
				validate: input => validate(prefixHook(input), type),
			},
			{
				...whenReduxHook,
				...INPUT,
				name: 'reducerName',
				message: "What's the name of the reducer?",
				default: 'reducer',
			},
			{
				...whenReduxHook,
				...STRING_TO_LIST,
				name: 'reduxActions',
				message: `[OPTIONAL] list the name of the actions delimited by comma i.e "someAction,someOtherAction"`, // - NOTE: Don't use comma (,) and escape double quotes(")
				default: 'someAction,someOtherAction',
			},
			{
				...whenReduxHook,
				...STRING_TO_LIST,
				name: 'reduxSelectors',
				message: `[OPTIONAL] List the name of the selectors delimited by comma i.e "someProp,someOtherProp"`, // - NOTE: Don't use comma (,) and escape double quotes(")
				default: 'someProp,someOtherProp',
			},
		]);

		return {
			type,
			name: prefixHook(name),
			...rest,
		};
	},
	actions: ({ type, reduxActions, reduxSelectors }) => {
		const _reduxActions = reduxActions && JSON.parse(reduxActions);
		const _reduxSelectors = reduxSelectors && JSON.parse(reduxSelectors);

		// NOTE: Right now this will always be true as we are passing defaults.
		// NOTE: Keep this syntax in case we change that default logic.
		const data = conditionalAdd(_reduxActions || _reduxSelectors, {
			data: {
				...conditionalAdd(_reduxActions, { _reduxActions }),
				...conditionalAdd(_reduxSelectors, { _reduxSelectors }),
			},
		});

		/** @type {import('node-plop/types/index').Actions} */
		const actions = [
			{
				outputFileName: '{{name}}.tsx',
				templateFileName: '{{type}}.tsx.hbs',
				...data,
			},
		];

		return generateActions(actions, type);
	},
};
