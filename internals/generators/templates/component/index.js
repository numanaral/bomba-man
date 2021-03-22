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
const TEMPLATE_TYPE = TEMPLATE_TYPES.COMPONENT;

/** @type {import('node-plop/types/index').PlopGeneratorConfig} */
module.exports = {
	description: 'Add an unconnected component',
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
	actions: ({ props, lazy }) => {
		const _props = props && JSON.parse(props);

		/** @type {import('node-plop/types/index').Actions} */
		const actions = [
			{
				outputFileName: '{{properCase name}}.tsx',
				templateFileName: 'component.tsx.hbs',
				...conditionalAdd(_props, {
					data: {
						_props,
					},
				}),
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
