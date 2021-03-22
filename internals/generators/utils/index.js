const fs = require('fs');
const path = require('path');
const {
	default: { properCase },
} = require('node-plop/lib/baked-in-helpers');

const { ABORT_ON_FAIL, ADD_ACTION_TYPE } = require('./constants');
const { TYPE_POST_SRC_PATHS, TEMPLATE_FOLDER_NAMES } = require('./constants');

// #region Get paths
const CREATE_SRC_PATH = '../../src/';
const SEARCH_SRC_PATH = `../${CREATE_SRC_PATH}`;
const FOLDER = '{{properCase name}}/';
const getSearchPath = type => SEARCH_SRC_PATH + TYPE_POST_SRC_PATHS[type];
// If we are generating a single file, there is no need to create a folder
const getCreatePath = (type, isFolder) => {
	const _folder = (isFolder && FOLDER) || '';
	return `${CREATE_SRC_PATH + TYPE_POST_SRC_PATHS[type]}/${_folder}`;
};
const getTemplatePath = type => {
	return `./templates/${TEMPLATE_FOLDER_NAMES[type] || type}/`;
};
// #endregion

// #region Make all actions abort on fail, set "add" type, and configure paths
const mapActions = type => (
	{ outputFileName, templateFileName, ...action },
	_,
	actions
) => {
	const createPath = getCreatePath(type, actions.length > 1);
	const templatePath = getTemplatePath(type);

	return {
		...action,
		...ADD_ACTION_TYPE,
		...ABORT_ON_FAIL,
		path: createPath + outputFileName,
		templateFile:
			templatePath +
			(templateFileName || `${outputFileName.toLowerCase()}.hbs`),
	};
};

const generateActions = (actions, type) => {
	return actions
		.map(mapActions(type))
		.concat(prettify(type, actions.length > 1));
};
// #endregion

// #region Prettify generate boiler-plate files
const prettify = (type, isFolder) => [
	{
		type: `prettify${(isFolder && 'Folder') || 'File'}`,
		path: `/${TYPE_POST_SRC_PATHS[type]}/`,
	},
];
// #endregion

// #region Transforms the input into proper case
const transformProperCase = {
	transformer: properCase,
};
// #endregion

// #region Prefixes the input that ran against proper case
const prefixProperCase = (prefix, input) => prefix + properCase(input);
// #endregion

// #region Validate file name and check if exists
const stripExtensions = s => s.replace(/\.[^.]*$/, '');
const flattenName = s => stripExtensions(s.toLowerCase());
const getFiles = type => {
	return fs
		.readdirSync(path.join(__dirname, getSearchPath(type)))
		.map(flattenName);
};
const fileOrFolderExists = (fileOrFolder, type) => {
	const files = getFiles(type);
	return files.includes(flattenName(fileOrFolder));
};
const validate = (value, fileType) => {
	if (!(value || '').length) return 'The name is required';
	if (fileOrFolderExists(value, fileType)) {
		return `A ${fileType} with this name already exists.`;
	}
	return true;
};
const validator = fileType => ({
	validate: input => validate(input, fileType),
});
// #endregion

// #region Conditional prompt
/**
 * Run the prompt only if the other promp was answered. If value is provided, then also check if the answer matches.
 *
 * @param {String} prompt "name" of the promp
 * @param {String} [value = null] Value to match to the found answer
 */
const when = (prompt, value = null) => ({
	when: answers => {
		return value !== null ? answers[prompt] === value : answers[prompt];
	},
});
// #endregion

// #region Conditional push/spread
/**
 *
 * @param {Boolean} condition Condition that decides if this is included or not.
 * @param {*} value Value to include
 * - If we are adding into an object, it needs to be type object
 * @param {String} type Type of object we are merging into
 * - 'array' || 'object'
 * - Defaults to 'array'
 */
const conditionalAdd = (condition, value, type = 'object') => {
	return type === 'array'
		? (condition && [value]) || []
		: {
				...(condition && value),
		  };
};

/**
 * Conditionally adds the action into the plop actions array
 *
 * @param {Boolean} condition Condition that decides if this is included or not.
 * @param {import('node-plop/types/index').ActionType} action Plop action type value to include
 */
const conditionalAction = (condition, action) => {
	return conditionalAdd(condition, action, 'array');
};
// #endregion

module.exports = {
	getSearchPath,
	getCreatePath,
	getTemplatePath,
	mapActions,
	generateActions,
	prettify,
	// plopHelpers
	fileOrFolderExists,
	transformProperCase,
	prefixProperCase,
	validate,
	validator,
	when,
	conditionalAdd,
	conditionalAction,
};
