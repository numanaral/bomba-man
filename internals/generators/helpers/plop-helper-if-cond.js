/* eslint-disable eqeqeq */
/**
 * @see https://stackoverflow.com/questions/8853396/logical-operator-in-a-handlebars-js-if-conditional#answer-16315366
 *
 * @param {*} left Left hand side of the equation
 * @param {String} operator Operator
 * - '==', '===', '!=', '!==', '<', '<=', '>', '>=', '&&', '||'
 * @param {*} right Right hand side of the equation
 * @param {Handlebars.HelperOptions} options Handlebar helper options
 */
const ifCond = function(left, operator, right, options) {
	switch (operator) {
		case '==':
			return left == right ? options.fn(this) : options.inverse(this);
		case '===':
			return left === right ? options.fn(this) : options.inverse(this);
		case '!=':
			return left != right ? options.fn(this) : options.inverse(this);
		case '!==':
			return left !== right ? options.fn(this) : options.inverse(this);
		case '<':
			return left < right ? options.fn(this) : options.inverse(this);
		case '<=':
			return left <= right ? options.fn(this) : options.inverse(this);
		case '>':
			return left > right ? options.fn(this) : options.inverse(this);
		case '>=':
			return left >= right ? options.fn(this) : options.inverse(this);
		case '&&':
			return left && right ? options.fn(this) : options.inverse(this);
		case '||':
			return left || right ? options.fn(this) : options.inverse(this);
		default:
			return options.inverse(this);
	}
};

module.exports = ifCond;
