'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _parse = require('@commitlint/parse');

var _parse2 = _interopRequireDefault(_parse);

var _footerEmpty19 = require('./footer-empty');

var _footerEmpty20 = _interopRequireDefault(_footerEmpty19);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const messages = {
	simple: 'test: subject',
	empty: 'test: subject\nbody',
	filled: 'test: subject\nBREAKING CHANGE: something important'
};

const parsed = {
	simple: (0, _parse2.default)(messages.simple),
	empty: (0, _parse2.default)(messages.empty),
	filled: (0, _parse2.default)(messages.filled)
};

(0, _ava2.default)('with simple message should succeed for empty keyword', t => new Promise(function ($return, $error) {
	var _footerEmpty, _footerEmpty2, actual, expected;

	return Promise.resolve(parsed.simple).then(function ($await_1) {
		try {
			_footerEmpty = (0, _footerEmpty20.default)($await_1), _footerEmpty2 = (0, _slicedToArray3.default)(_footerEmpty, 1);
			actual = _footerEmpty2[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with simple message should fail for "never"', t => new Promise(function ($return, $error) {
	var _footerEmpty3, _footerEmpty4, actual, expected;

	return Promise.resolve(parsed.simple).then(function ($await_2) {
		try {
			_footerEmpty3 = (0, _footerEmpty20.default)($await_2, 'never'), _footerEmpty4 = (0, _slicedToArray3.default)(_footerEmpty3, 1);
			actual = _footerEmpty4[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with simple message should succeed for "always"', t => new Promise(function ($return, $error) {
	var _footerEmpty5, _footerEmpty6, actual, expected;

	return Promise.resolve(parsed.simple).then(function ($await_3) {
		try {
			_footerEmpty5 = (0, _footerEmpty20.default)($await_3, 'always'), _footerEmpty6 = (0, _slicedToArray3.default)(_footerEmpty5, 1);
			actual = _footerEmpty6[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty footer should succeed for empty keyword', t => new Promise(function ($return, $error) {
	var _footerEmpty7, _footerEmpty8, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_4) {
		try {
			_footerEmpty7 = (0, _footerEmpty20.default)($await_4), _footerEmpty8 = (0, _slicedToArray3.default)(_footerEmpty7, 1);
			actual = _footerEmpty8[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty footer should fail for "never"', t => new Promise(function ($return, $error) {
	var _footerEmpty9, _footerEmpty10, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_5) {
		try {
			_footerEmpty9 = (0, _footerEmpty20.default)($await_5, 'never'), _footerEmpty10 = (0, _slicedToArray3.default)(_footerEmpty9, 1);
			actual = _footerEmpty10[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty footer should succeed for "always"', t => new Promise(function ($return, $error) {
	var _footerEmpty11, _footerEmpty12, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_6) {
		try {
			_footerEmpty11 = (0, _footerEmpty20.default)($await_6, 'always'), _footerEmpty12 = (0, _slicedToArray3.default)(_footerEmpty11, 1);
			actual = _footerEmpty12[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with footer should fail for empty keyword', t => new Promise(function ($return, $error) {
	var _footerEmpty13, _footerEmpty14, actual, expected;

	return Promise.resolve(parsed.filled).then(function ($await_7) {
		try {
			_footerEmpty13 = (0, _footerEmpty20.default)($await_7), _footerEmpty14 = (0, _slicedToArray3.default)(_footerEmpty13, 1);
			actual = _footerEmpty14[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with footer should succeed for "never"', t => new Promise(function ($return, $error) {
	var _footerEmpty15, _footerEmpty16, actual, expected;

	return Promise.resolve(parsed.filled).then(function ($await_8) {
		try {
			_footerEmpty15 = (0, _footerEmpty20.default)($await_8, 'never'), _footerEmpty16 = (0, _slicedToArray3.default)(_footerEmpty15, 1);
			actual = _footerEmpty16[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with footer should fail for "always"', t => new Promise(function ($return, $error) {
	var _footerEmpty17, _footerEmpty18, actual, expected;

	return Promise.resolve(parsed.filled).then(function ($await_9) {
		try {
			_footerEmpty17 = (0, _footerEmpty20.default)($await_9, 'always'), _footerEmpty18 = (0, _slicedToArray3.default)(_footerEmpty17, 1);
			actual = _footerEmpty18[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));
//# sourceMappingURL=footer-empty.test.js.map