'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _parse = require('@commitlint/parse');

var _parse2 = _interopRequireDefault(_parse);

var _typeEmpty13 = require('./type-empty');

var _typeEmpty14 = _interopRequireDefault(_typeEmpty13);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const messages = {
	empty: '(scope):',
	filled: 'type: subject'
};

const parsed = {
	empty: (0, _parse2.default)(messages.empty),
	filled: (0, _parse2.default)(messages.filled)
};

(0, _ava2.default)('without type should succeed for empty keyword', t => new Promise(function ($return, $error) {
	var _typeEmpty, _typeEmpty2, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_1) {
		try {
			_typeEmpty = (0, _typeEmpty14.default)($await_1), _typeEmpty2 = (0, _slicedToArray3.default)(_typeEmpty, 1);
			actual = _typeEmpty2[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('without type should fail for "never"', t => new Promise(function ($return, $error) {
	var _typeEmpty3, _typeEmpty4, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_2) {
		try {
			_typeEmpty3 = (0, _typeEmpty14.default)($await_2, 'never'), _typeEmpty4 = (0, _slicedToArray3.default)(_typeEmpty3, 1);
			actual = _typeEmpty4[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('without type should succeed for "always"', t => new Promise(function ($return, $error) {
	var _typeEmpty5, _typeEmpty6, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_3) {
		try {
			_typeEmpty5 = (0, _typeEmpty14.default)($await_3, 'always'), _typeEmpty6 = (0, _slicedToArray3.default)(_typeEmpty5, 1);
			actual = _typeEmpty6[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with type fail for empty keyword', t => new Promise(function ($return, $error) {
	var _typeEmpty7, _typeEmpty8, actual, expected;

	return Promise.resolve(parsed.filled).then(function ($await_4) {
		try {
			_typeEmpty7 = (0, _typeEmpty14.default)($await_4), _typeEmpty8 = (0, _slicedToArray3.default)(_typeEmpty7, 1);
			actual = _typeEmpty8[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with type succeed for "never"', t => new Promise(function ($return, $error) {
	var _typeEmpty9, _typeEmpty10, actual, expected;

	return Promise.resolve(parsed.filled).then(function ($await_5) {
		try {
			_typeEmpty9 = (0, _typeEmpty14.default)($await_5, 'never'), _typeEmpty10 = (0, _slicedToArray3.default)(_typeEmpty9, 1);
			actual = _typeEmpty10[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with type fail for "always"', t => new Promise(function ($return, $error) {
	var _typeEmpty11, _typeEmpty12, actual, expected;

	return Promise.resolve(parsed.filled).then(function ($await_6) {
		try {
			_typeEmpty11 = (0, _typeEmpty14.default)($await_6, 'always'), _typeEmpty12 = (0, _slicedToArray3.default)(_typeEmpty11, 1);
			actual = _typeEmpty12[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));
//# sourceMappingURL=type-empty.test.js.map