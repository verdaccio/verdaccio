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
	return [(0, _ensure.minLength)(input, value), `subject must not be shorter than ${value} characters`];
};

module.exports = exports.default;
//# sourceMappingURL=subject-min-length.js.map