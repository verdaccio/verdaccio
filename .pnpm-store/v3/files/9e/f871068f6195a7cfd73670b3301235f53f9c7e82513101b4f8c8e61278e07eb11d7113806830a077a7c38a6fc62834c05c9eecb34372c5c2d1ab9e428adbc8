'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ensure = require('@commitlint/ensure');

exports.default = (parsed, when, value) => {
	if (!parsed.footer) {
		return [true];
	}
	return [(0, _ensure.minLength)(parsed.footer, value), `footer must not be shorter than ${value} characters`];
};

module.exports = exports.default;
//# sourceMappingURL=footer-min-length.js.map