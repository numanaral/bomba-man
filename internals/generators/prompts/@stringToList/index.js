// const {  } = require('@inquirer');
const { createPrompt, useState, useKeypress } = require('@inquirer/core/hooks');
const { usePrefix } = require('@inquirer/core/lib/prefix');
const { isEnterKey, isBackspaceKey } = require('@inquirer/core/lib/key');
const chalk = require('chalk');

/**
 * Takes in an input and returns a stringified array for an easy conversion in actions.
 *
 * @example
 * ```js
 * (async () => {
 * 	const props = await promptStringToList({
 * 		message: 'List the name of the props delimited by comma i.e "name,age"',
 * 	});
 * 	console.log(JSON.parse(props));
 * })();
 * ```
 */
const stringToListPromp = createPrompt((config, done) => {
	const [status, setStatus] = useState('pending');
	const [defaultValue, setDefaultValue] = useState(config.default);
	const [errorMsg, setError] = useState();
	const [value, setValue] = useState('');

	const isLoading = status === 'loading';
	const prefix = usePrefix(isLoading);

	const stringToArray = input => {
		return input
			? input
					.split(',')
					.map(s => s.trim())
					.filter(Boolean)
			: [];
	};

	const prettifyArray = input => {
		return input
			? `\n[\n\t${input
					.split(',')
					.map(s => `"${s.trim()}"`)
					.join(',\n\t')}\n]\n`
			: '';
	};

	useKeypress(async (key, rl) => {
		// Ignore keypress while our prompt is doing other processing.
		if (status !== 'pending') return;

		if (isEnterKey(key)) {
			const _value = value || defaultValue || '';
			const answer = JSON.stringify(
				// Ensure we generate a proper array
				stringToArray(_value)
			);
			setStatus('loading');
			const isValid = await config.validate(answer);
			if (isValid === true) {
				setValue(_value);
				setStatus('done');
				done(answer);
			} else {
				setValue('');
				setError(isValid || 'You must provide a valid value');
				setStatus('pending');
			}
		} else if (isBackspaceKey(key) && !value) {
			setDefaultValue(undefined);
		} else {
			setValue(rl.line);
			setError(undefined);
		}
	});

	const message = chalk.bold(config.message);
	let formattedValue = prettifyArray(value);
	if (typeof config.transformer === 'function') {
		setError('You cannot use a transformer');
		/* formattedValue = config.transformer(value, {
			isFinal: status === 'done',
		}); */
	}
	if (status === 'done') formattedValue = chalk.cyan(formattedValue);

	let defaultStr = '';
	if (defaultValue && status !== 'done' && !value) {
		defaultStr = chalk.dim(` (${defaultValue})`);
	}

	const error = (errorMsg && chalk.red(`> ${errorMsg}`)) || '';

	return [`${prefix} ${message}${defaultStr} ${formattedValue}`, error];
});

module.exports = stringToListPromp;
