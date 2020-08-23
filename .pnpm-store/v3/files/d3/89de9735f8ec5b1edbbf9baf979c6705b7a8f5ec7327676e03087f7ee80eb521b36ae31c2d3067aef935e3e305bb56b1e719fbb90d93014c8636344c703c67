'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _message = require('@commitlint/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (parsed, when, value) => {
	const input = parsed.subject;

	if (!input) {
		return [true];
	}

	const negated = when === 'never';
	const hasStop = input[input.length - 1] === value;

	return [negated ? !hasStop : hasStop, (0, _message2.default)(['subject', negated ? 'may not' : 'must', 'end with full stop'])];
};

module.exports = exports.default;
//# sourceMappingURL=subject-full-stop.js.map