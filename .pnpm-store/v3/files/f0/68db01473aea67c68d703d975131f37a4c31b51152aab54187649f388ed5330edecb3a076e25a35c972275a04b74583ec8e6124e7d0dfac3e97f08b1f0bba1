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
	// Flunk if no body is found
	if (!parsed.body) {
		return [true];
	}

	const negated = when === 'never';

	var _toLines$slice = (0, _toLines2.default)(parsed.raw).slice(1),
	    _toLines$slice2 = (0, _slicedToArray3.default)(_toLines$slice, 1);

	const leading = _toLines$slice2[0];

	// Check if the first line of body is empty

	const succeeds = leading === '';

	return [negated ? !succeeds : succeeds, (0, _message2.default)(['body', negated ? 'may not' : 'must', 'have leading blank line'])];
};

module.exports = exports.default;
//# sourceMappingURL=body-leading-blank.js.map