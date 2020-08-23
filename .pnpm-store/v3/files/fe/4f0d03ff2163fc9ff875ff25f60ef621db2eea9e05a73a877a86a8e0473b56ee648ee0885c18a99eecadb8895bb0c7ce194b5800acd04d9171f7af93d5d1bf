'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _message = require('@commitlint/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (parsed, when = 'never') => {
	const negated = when === 'always';
	const notEmpty = parsed.references.length > 0;
	return [negated ? !notEmpty : notEmpty, (0, _message2.default)(['references', negated ? 'must' : 'may not', 'be empty'])];
};

module.exports = exports.default;
//# sourceMappingURL=references-empty.js.map