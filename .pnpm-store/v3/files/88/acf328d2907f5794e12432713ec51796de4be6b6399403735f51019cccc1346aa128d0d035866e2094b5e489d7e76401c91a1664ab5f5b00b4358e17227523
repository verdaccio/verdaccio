'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _parse = require('@commitlint/parse');

var _parse2 = _interopRequireDefault(_parse);

var _bodyLeadingBlank19 = require('./body-leading-blank');

var _bodyLeadingBlank20 = _interopRequireDefault(_bodyLeadingBlank19);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const messages = {
	simple: 'test: subject',
	without: 'test: subject\nbody',
	with: 'test: subject\n\nbody'
};

const parsed = {
	simple: (0, _parse2.default)(messages.simple),
	without: (0, _parse2.default)(messages.without),
	with: (0, _parse2.default)(messages.with)
};

(0, _ava2.default)('with simple message should succeed for empty keyword', t => new Promise(function ($return, $error) {
	var _bodyLeadingBlank, _bodyLeadingBlank2, actual, expected;

	return Promise.resolve(parsed.simple).then(function ($await_1) {
		try {
			_bodyLeadingBlank = (0, _bodyLeadingBlank20.default)($await_1), _bodyLeadingBlank2 = (0, _slicedToArray3.default)(_bodyLeadingBlank, 1);
			actual = _bodyLeadingBlank2[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with simple message should succeed for "never"', t => new Promise(function ($return, $error) {
	var _bodyLeadingBlank3, _bodyLeadingBlank4, actual, expected;

	return Promise.resolve(parsed.simple).then(function ($await_2) {
		try {
			_bodyLeadingBlank3 = (0, _bodyLeadingBlank20.default)($await_2, 'never'), _bodyLeadingBlank4 = (0, _slicedToArray3.default)(_bodyLeadingBlank3, 1);
			actual = _bodyLeadingBlank4[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with simple message should succeed for "always"', t => new Promise(function ($return, $error) {
	var _bodyLeadingBlank5, _bodyLeadingBlank6, actual, expected;

	return Promise.resolve(parsed.simple).then(function ($await_3) {
		try {
			_bodyLeadingBlank5 = (0, _bodyLeadingBlank20.default)($await_3, 'always'), _bodyLeadingBlank6 = (0, _slicedToArray3.default)(_bodyLeadingBlank5, 1);
			actual = _bodyLeadingBlank6[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('without blank line before body should fail for empty keyword', t => new Promise(function ($return, $error) {
	var _bodyLeadingBlank7, _bodyLeadingBlank8, actual, expected;

	return Promise.resolve(parsed.without).then(function ($await_4) {
		try {
			_bodyLeadingBlank7 = (0, _bodyLeadingBlank20.default)($await_4), _bodyLeadingBlank8 = (0, _slicedToArray3.default)(_bodyLeadingBlank7, 1);
			actual = _bodyLeadingBlank8[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('without blank line before body should succeed for "never"', t => new Promise(function ($return, $error) {
	var _bodyLeadingBlank9, _bodyLeadingBlank10, actual, expected;

	return Promise.resolve(parsed.without).then(function ($await_5) {
		try {
			_bodyLeadingBlank9 = (0, _bodyLeadingBlank20.default)($await_5, 'never'), _bodyLeadingBlank10 = (0, _slicedToArray3.default)(_bodyLeadingBlank9, 1);
			actual = _bodyLeadingBlank10[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('without blank line before body should fail for "always"', t => new Promise(function ($return, $error) {
	var _bodyLeadingBlank11, _bodyLeadingBlank12, actual, expected;

	return Promise.resolve(parsed.without).then(function ($await_6) {
		try {
			_bodyLeadingBlank11 = (0, _bodyLeadingBlank20.default)($await_6, 'always'), _bodyLeadingBlank12 = (0, _slicedToArray3.default)(_bodyLeadingBlank11, 1);
			actual = _bodyLeadingBlank12[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with blank line before body should succeed for empty keyword', t => new Promise(function ($return, $error) {
	var _bodyLeadingBlank13, _bodyLeadingBlank14, actual, expected;

	return Promise.resolve(parsed.with).then(function ($await_7) {
		try {
			_bodyLeadingBlank13 = (0, _bodyLeadingBlank20.default)($await_7), _bodyLeadingBlank14 = (0, _slicedToArray3.default)(_bodyLeadingBlank13, 1);
			actual = _bodyLeadingBlank14[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with blank line before body should fail for "never"', t => new Promise(function ($return, $error) {
	var _bodyLeadingBlank15, _bodyLeadingBlank16, actual, expected;

	return Promise.resolve(parsed.with).then(function ($await_8) {
		try {
			_bodyLeadingBlank15 = (0, _bodyLeadingBlank20.default)($await_8, 'never'), _bodyLeadingBlank16 = (0, _slicedToArray3.default)(_bodyLeadingBlank15, 1);
			actual = _bodyLeadingBlank16[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with blank line before body should succeed for "always"', t => new Promise(function ($return, $error) {
	var _bodyLeadingBlank17, _bodyLeadingBlank18, actual, expected;

	return Promise.resolve(parsed.with).then(function ($await_9) {
		try {
			_bodyLeadingBlank17 = (0, _bodyLeadingBlank20.default)($await_9, 'always'), _bodyLeadingBlank18 = (0, _slicedToArray3.default)(_bodyLeadingBlank17, 1);
			actual = _bodyLeadingBlank18[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));
//# sourceMappingURL=body-leading-blank.test.js.map