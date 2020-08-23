'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _message = require('@commitlint/message');

var _message2 = _interopRequireDefault(_message);

var _toLines = require('@commitlint/to-lines');

var _toLines2 = _interopRequireDefault(_toLines);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (parsed, when, value) => {
	const lines = (0, _toLines2.default)(parsed.raw).filter(Boolean);
	const last = lines[lines.length - 1];

	const negated = when === 'never';
	const hasSignedOffBy = last.startsWith(value);

	return [negated ? !hasSignedOffBy : hasSignedOffBy, (0, _message2.default)(['message', negated ? 'must not' : 'must', 'be signed off'])];
};

module.exports = exports.default;
//# sourceMappingURL=signed-off-by.js.map