'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _message = require('@commitlint/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (parsed, when, value) => {
	const header = parsed.header;

	const negated = when === 'never';
	const hasStop = header[header.length - 1] === value;

	return [negated ? !hasStop : hasStop, (0, _message2.default)(['header', negated ? 'may not' : 'must', 'end with full stop'])];
};

module.exports = exports.default;
//# sourceMappingURL=header-full-stop.js.map