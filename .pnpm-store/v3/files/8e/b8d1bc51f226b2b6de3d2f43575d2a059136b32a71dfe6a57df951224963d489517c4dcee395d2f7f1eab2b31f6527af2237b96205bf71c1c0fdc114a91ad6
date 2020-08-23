'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ensure = require('@commitlint/ensure');

exports.default = (parsed, when, value) => {
	const input = parsed.subject;

	if (!input) {
		return [true];
	}

	return [(0, _ensure.maxLength)(input, value), `subject must not be longer than ${value} characters`];
};

module.exports = exports.default;
//# sourceMappingURL=subject-max-length.js.map