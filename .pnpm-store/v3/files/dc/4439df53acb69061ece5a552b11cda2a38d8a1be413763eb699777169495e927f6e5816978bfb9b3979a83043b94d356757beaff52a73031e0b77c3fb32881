'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ensure = require('@commitlint/ensure');

exports.default = (parsed, when, value) => {
	const input = parsed.footer;

	if (!input) {
		return [true];
	}

	return [(0, _ensure.maxLineLength)(input, value), `footer's lines must not be longer than ${value} characters`];
};

module.exports = exports.default;
//# sourceMappingURL=footer-max-line-length.js.map