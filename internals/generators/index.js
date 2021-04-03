const path = require('path');
const { execSync } = require('child_process');
const componentGenerator = require('./templates/component/index');
const containerGenerator = require('./templates/container/index');
const providerGenerator = require('./templates/provider/index');
const hookGenerator = require('./templates/hooks/index');
const promptStringToList = require('./prompts/plop-prompt-string-to-list');
const ifCond = require('./helpers/plop-helper-if-cond');

/**
 * Generator function to be used by plop
 *
 * @param {import('node-plop/types/index').NodePlopAPI} plop
 */
module.exports = plop => {
	// Custom generators
	plop.setGenerator('component', componentGenerator);
	plop.setGenerator('container', containerGenerator);
	plop.setGenerator('provider', providerGenerator);
	plop.setGenerator('hook', hookGenerator);
	// Custom prompts
	plop.setPrompt('stringToList', promptStringToList);
	// Custom helpers
    // {{curly true}}{{name}}{{curly}}
	plop.addHelper('curly', (object, open) => (open ? '{' : '}'));
	// {{#ifCond condition1 '||' condition2}} 
	plop.setHelper('ifCond', ifCond);

	// Custom actions
	/**
	 * Prettifies files in a folder post creation
	 * @see https://github.com/react-boilerplate/react-boilerplate/blob/master/internals/generators/index.js#L36
	 */
	plop.setActionType('prettifyFolder', (answers, config) => {
		const folderPath = `${path.join(
			__dirname,
			'/../../src/',
			config.path,
			plop.getHelper('properCase')(answers.name),
			'**',
			'**.tsx'
		)}`;

		execSync(`prettier --write -- "${folderPath}"`);
		return folderPath;
	});
	/**
	 * Prettifies the file post creation
	 * @see https://github.com/react-boilerplate/react-boilerplate/blob/master/internals/generators/index.js#L36
	 */
	plop.setActionType('prettifyFile', (answers, config) => {
		const filePath = `${path.join(
			__dirname,
			'/../../src/',
			config.path,
			`${answers.name}.tsx`
		)}`;

		execSync(`prettier --write -- "${filePath}"`);
		return filePath;
	});
};
