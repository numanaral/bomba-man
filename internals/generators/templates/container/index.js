const { TEMPLATE_TYPES, PROMPT_TYPES } = require('../../utils/constants');
const {
	transformProperCase,
	when,
	conditionalAdd,
	conditionalAction,
	validator,
	generateActions,
} = require('../../utils');

const { INPUT, CONFIRM, STRING_TO_LIST } = PROMPT_TYPES;
const TEMPLATE_TYPE = TEMPLATE_TYPES.CONTAINER;

/** @type {import('node-plop/types/index').PlopGeneratorConfig} plop */
module.exports = {
	description: 'Adds a container with logic.',
	prompts: [
		{
			...INPUT,
			name: 'name',
			message: 'What should it be called?',
			...validator(TEMPLATE_TYPE),
			...transformProperCase,
		},
		{
			...CONFIRM,
			name: 'redux',
			message: 'Do you want redux hooks?',
			default: false,
		},
		{
			...when('redux'),
			...INPUT,
			name: 'reducerName',
			message: "What's the name of the reducer?",
			default: 'reducer',
		},
		{
			...when('redux'),
			...STRING_TO_LIST,
			name: 'reduxActions',
			message: `[OPTIONAL] list the name of the actions delimited by comma i.e "someAction,someOtherAction"`, // - NOTE: Don't use comma (,) and escape double quotes(")
			default: 'someAction,someOtherAction',
		},
		{
			...when('redux'),
			...STRING_TO_LIST,
			name: 'reduxSelectors',
			message: `[OPTIONAL] List the name of the selectors delimited by comma i.e "someProp,someOtherProp"`, // - NOTE: Don't use comma (,) and escape double quotes(")
			default: 'someProp,someOtherProp',
		},
		{
			...CONFIRM,
			name: 'propTypes',
			message: 'Do you want prop-types?',
			default: true,
		},
		{
			...when('propTypes'),
			...STRING_TO_LIST,
			name: 'props',
			message: `[OPTIONAL] list the name of the props delimited by comma i.e "name,age"`, // - NOTE: Don't use comma (,) and escape double quotes(")
			default: 'prop',
		},
		{
			...CONFIRM,
			name: 'styled',
			default: true,
			message: 'Do you want styled-components?',
		},
		{
			...CONFIRM,
			name: 'lazy',
			message: 'Do you want a lazy version?',
			default: true,
		},
		{
			...CONFIRM,
			name: 'memo',
			message: 'Do you want it memoized?',
			default: false,
		},
	],
	actions: ({ props, lazy, reduxActions, reduxSelectors }) => {
		const _props = props && JSON.parse(props);
		const _reduxActions = reduxActions && JSON.parse(reduxActions);
		const _reduxSelectors = reduxSelectors && JSON.parse(reduxSelectors);

		const data = conditionalAdd(
			_props || _reduxActions || _reduxSelectors,
			{
				data: {
					...conditionalAdd(_props, { _props }),
					...conditionalAdd(_reduxActions, { _reduxActions }),
					...conditionalAdd(_reduxSelectors, { _reduxSelectors }),
				},
			}
		);

		/** @type {import('node-plop/types/index').Actions} */
		const actions = [
			{
				outputFileName: '{{properCase name}}.tsx',
				templateFileName: 'container.tsx.hbs',
				...data,
			},
			{
				outputFileName: `index.tsx`,
			},
			...conditionalAction(lazy, {
				outputFileName: `Lazy.tsx`,
			}),
		];

		return generateActions(actions, TEMPLATE_TYPE);
	},
};
