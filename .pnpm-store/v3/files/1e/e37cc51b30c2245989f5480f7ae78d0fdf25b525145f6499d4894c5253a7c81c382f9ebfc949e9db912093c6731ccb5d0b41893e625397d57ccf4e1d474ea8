'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ensure = require('@commitlint/ensure');

exports.default = (parsed, when, value) => {
	if (!parsed.body) {
		return [true];
	}

	return [(0, _ensure.minLength)(parsed.body, value), `body must not be shorter than ${value} characters`];
};

module.exports = exports.default;
//# sourceMappingURL=body-min-length.js.map