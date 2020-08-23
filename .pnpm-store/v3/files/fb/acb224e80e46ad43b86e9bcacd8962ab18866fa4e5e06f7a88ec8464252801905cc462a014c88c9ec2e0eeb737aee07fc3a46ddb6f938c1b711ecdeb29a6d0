'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ensure = require('@commitlint/ensure');

exports.default = (parsed, when, value) => {
	const input = parsed.scope;
	if (!input) {
		return [true];
	}
	return [(0, _ensure.minLength)(input, value), `scope must not be shorter than ${value} characters`];
};

module.exports = exports.default;
//# sourceMappingURL=scope-min-length.js.map