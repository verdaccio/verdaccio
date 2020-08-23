'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _parse = require('@commitlint/parse');

var _parse2 = _interopRequireDefault(_parse);

var _scopeEmpty19 = require('./scope-empty');

var _scopeEmpty20 = _interopRequireDefault(_scopeEmpty19);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const messages = {
	plain: 'foo(bar): baz',
	superfluous: 'foo(): baz',
	empty: 'foo: baz'
};

const parsed = {
	plain: (0, _parse2.default)(messages.plain),
	superfluous: (0, _parse2.default)(messages.superfluous),
	empty: (0, _parse2.default)(messages.empty)
};

(0, _ava2.default)('with plain message it should succeed for empty keyword', t => new Promise(function ($return, $error) {
	var _scopeEmpty, _scopeEmpty2, actual, expected;

	return Promise.resolve(parsed.plain).then(function ($await_1) {
		try {
			_scopeEmpty = (0, _scopeEmpty20.default)($await_1), _scopeEmpty2 = (0, _slicedToArray3.default)(_scopeEmpty, 1);
			actual = _scopeEmpty2[0];
			expected = true;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with plain message it should succeed for "never"', t => new Promise(function ($return, $error) {
	var _scopeEmpty3, _scopeEmpty4, actual, expected;

	return Promise.resolve(parsed.plain).then(function ($await_2) {
		try {
			_scopeEmpty3 = (0, _scopeEmpty20.default)($await_2, 'never'), _scopeEmpty4 = (0, _slicedToArray3.default)(_scopeEmpty3, 1);
			actual = _scopeEmpty4[0];
			expected = true;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with plain message it should fail for "always"', t => new Promise(function ($return, $error) {
	var _scopeEmpty5, _scopeEmpty6, actual, expected;

	return Promise.resolve(parsed.plain).then(function ($await_3) {
		try {
			_scopeEmpty5 = (0, _scopeEmpty20.default)($await_3, 'always'), _scopeEmpty6 = (0, _slicedToArray3.default)(_scopeEmpty5, 1);
			actual = _scopeEmpty6[0];
			expected = false;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with superfluous message it should fail for empty keyword', t => new Promise(function ($return, $error) {
	var _scopeEmpty7, _scopeEmpty8, actual, expected;

	return Promise.resolve(parsed.superfluous).then(function ($await_4) {
		try {
			_scopeEmpty7 = (0, _scopeEmpty20.default)($await_4), _scopeEmpty8 = (0, _slicedToArray3.default)(_scopeEmpty7, 1);
			actual = _scopeEmpty8[0];
			expected = false;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with superfluous message it should fail for "never"', t => new Promise(function ($return, $error) {
	var _scopeEmpty9, _scopeEmpty10, actual, expected;

	return Promise.resolve(parsed.superfluous).then(function ($await_5) {
		try {
			_scopeEmpty9 = (0, _scopeEmpty20.default)($await_5, 'never'), _scopeEmpty10 = (0, _slicedToArray3.default)(_scopeEmpty9, 1);
			actual = _scopeEmpty10[0];
			expected = false;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with superfluous message it should fail for "always"', t => new Promise(function ($return, $error) {
	var _scopeEmpty11, _scopeEmpty12, actual, expected;

	return Promise.resolve(parsed.superfluous).then(function ($await_6) {
		try {
			_scopeEmpty11 = (0, _scopeEmpty20.default)($await_6, 'always'), _scopeEmpty12 = (0, _slicedToArray3.default)(_scopeEmpty11, 1);
			actual = _scopeEmpty12[0];
			expected = true;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty message it should fail for empty keyword', t => new Promise(function ($return, $error) {
	var _scopeEmpty13, _scopeEmpty14, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_7) {
		try {
			_scopeEmpty13 = (0, _scopeEmpty20.default)($await_7), _scopeEmpty14 = (0, _slicedToArray3.default)(_scopeEmpty13, 1);
			actual = _scopeEmpty14[0];
			expected = false;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty message it should fail for "never"', t => new Promise(function ($return, $error) {
	var _scopeEmpty15, _scopeEmpty16, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_8) {
		try {
			_scopeEmpty15 = (0, _scopeEmpty20.default)($await_8, 'never'), _scopeEmpty16 = (0, _slicedToArray3.default)(_scopeEmpty15, 1);
			actual = _scopeEmpty16[0];
			expected = false;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty message it should fail for "always"', t => new Promise(function ($return, $error) {
	var _scopeEmpty17, _scopeEmpty18, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_9) {
		try {
			_scopeEmpty17 = (0, _scopeEmpty20.default)($await_9, 'always'), _scopeEmpty18 = (0, _slicedToArray3.default)(_scopeEmpty17, 1);
			actual = _scopeEmpty18[0];
			expected = true;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));
//# sourceMappingURL=scope-empty.test.js.map