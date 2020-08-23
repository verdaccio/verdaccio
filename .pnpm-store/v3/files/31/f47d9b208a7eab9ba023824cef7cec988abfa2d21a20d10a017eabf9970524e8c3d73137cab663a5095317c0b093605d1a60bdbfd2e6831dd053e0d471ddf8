'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ensure = require('@commitlint/ensure');

exports.default = (parsed, when, value) => {
	const input = parsed.type;

	if (!input) {
		return [true];
	}

	return [(0, _ensure.maxLength)(input, value), `type must not be longer than ${value} characters`];
};

module.exports = exports.default;
//# sourceMappingURL=type-max-length.js.map