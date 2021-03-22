/**
 * `stringToList` type prompt
 */

const chalk = require('chalk');
const InputPrompt = require('inquirer/lib/prompts/input');

/**
 * Takes in an input and returns a stringified array for an easy conversion in actions.
 *
 * @example
 * ```js
 * // IN:
 * 'prop1, prop2'
 * 'prop1,,,,prop2'
 * 'prop1,prop2,,'
 * // OUT:
 * ["prop1", "prop2"]
 *
 * // ==================
 * // inquire Usage
 * // ==================
 * const promptStringToList = require('./utils/prompts/stringToList');
 *
 * inquirer.registerPrompt('stringToList', promptStringToList);
 * inquirer.prompt([{
 *   type: 'stringToList',
 *   name: 'props',
 *   message: 'List the name of the props delimited by comma i.e "name,age"',
 * }]).then(function(answers) {
 * 	// The generated array
 *  const props = JSON.parse(answers.props);
 * });
 *
 * // ==================
 * // plop Usage
 * // ==================
 * // Registry
 * const promptStringToList = require('./utils/prompts/stringToList');
 * module.exports = plop => {
 * 	plop.setPrompt('stringToList', promptStringToList);
 * };
 * // Generator
 * module.exports = {
 * 	description: 'Some generator',
 * 	prompts: [
 * 		{
 * 			type: 'stringToList',
 * 			name: 'props',
 * 			// ... prompt props
 * 		}
 * 	],
 * 	actions: data => {
 * 		// The generated array
 * 		const props = JSON.parse(data.props);
 * 		return [
 * 			// ...actions
 * 		];
 * 	},
 * }
 * ```
 */
class StringToListPrompt extends InputPrompt {
	/**
	 * Render the prompt to screen
	 * @return {StringToListPrompt} self
	 */

	render(error) {
		let bottomContent = '';
		let appendContent = '';
		let message = this.getQuestion();
		const { transformer } = this.opt;
		const isFinal = this.status === 'answered';

		if (isFinal) {
			appendContent = this.generateResult(this.answer);
		} else {
			appendContent = this.prettifyArray(this.rl.line);
		}

		if (transformer) {
			throw new Error('Cannot use a transformer');
		} else {
			message += isFinal ? chalk.cyan(appendContent) : appendContent;
		}

		if (error) {
			bottomContent = chalk.red('>> ') + error;
		}

		this.screen.render(message, bottomContent);
	}

	onEnd(state) {
		this.answer = state.value;
		this.status = 'answered';

		// Re-render prompt
		this.render();

		this.screen.done();
		this.done(this.generateResult(state.value));
	}

	generateResult = input => {
		return JSON.stringify(
			// Ensure we generate a proper array
			this.stringToArray(input)
		);
	};

	stringToArray = input => {
		return input
			? input
					.split(',')
					.map(s => s.trim())
					.filter(Boolean)
			: [];
	};

	prettifyArray = input => {
		return input
			? `\n[\n\t${input
					.split(',')
					.map(s => `"${s.trim()}"`)
					.join(',\n\t')}\n]\n`
			: '';
	};
}

module.exports = StringToListPrompt;
