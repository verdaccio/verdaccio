'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _toLines = require('@commitlint/to-lines');

var _toLines2 = _interopRequireDefault(_toLines);

var _message = require('@commitlint/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (parsed, when) => {
	// Flunk if no footer is found
	if (!parsed.footer) {
		return [true];
	}

	const negated = when === 'never';
	const rawLines = (0, _toLines2.default)(parsed.raw);
	const bodyLines = (0, _toLines2.default)(parsed.body);
	const bodyOffset = bodyLines.length > 0 ? rawLines.indexOf(bodyLines[0]) : 1;

	var _rawLines$slice = rawLines.slice(bodyLines.length + bodyOffset),
	    _rawLines$slice2 = (0, _slicedToArray3.default)(_rawLines$slice, 1);

	const leading = _rawLines$slice2[0];

	// Check if the first line of footer is empty

	const succeeds = leading === '';

	return [negated ? !succeeds : succeeds, (0, _message2.default)(['footer', negated ? 'may not' : 'must', 'have leading blank line'])];
};

module.exports = exports.default;
//# sourceMappingURL=footer-leading-blank.js.map