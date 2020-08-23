'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ensure = require('@commitlint/ensure');

exports.default = (parsed, when, value) => {
	const input = parsed.body;

	if (!input) {
		return [true];
	}

	return [(0, _ensure.maxLineLength)(input, value), `body's lines must not be longer than ${value} characters`];
};

module.exports = exports.default;
//# sourceMappingURL=body-max-line-length.js.map