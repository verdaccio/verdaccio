'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _parse = require('@commitlint/parse');

var _parse2 = _interopRequireDefault(_parse);

var _bodyEmpty13 = require('./body-empty');

var _bodyEmpty14 = _interopRequireDefault(_bodyEmpty13);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const messages = {
	empty: 'test: subject',
	filled: 'test: subject\nbody'
};

const parsed = {
	empty: (0, _parse2.default)(messages.empty),
	filled: (0, _parse2.default)(messages.filled)
};

(0, _ava2.default)('with empty body should succeed for empty keyword', t => new Promise(function ($return, $error) {
	var _bodyEmpty, _bodyEmpty2, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_1) {
		try {
			_bodyEmpty = (0, _bodyEmpty14.default)($await_1), _bodyEmpty2 = (0, _slicedToArray3.default)(_bodyEmpty, 1);
			actual = _bodyEmpty2[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty body should fail for "never"', t => new Promise(function ($return, $error) {
	var _bodyEmpty3, _bodyEmpty4, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_2) {
		try {
			_bodyEmpty3 = (0, _bodyEmpty14.default)($await_2, 'never'), _bodyEmpty4 = (0, _slicedToArray3.default)(_bodyEmpty3, 1);
			actual = _bodyEmpty4[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty body should succeed for "always"', t => new Promise(function ($return, $error) {
	var _bodyEmpty5, _bodyEmpty6, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_3) {
		try {
			_bodyEmpty5 = (0, _bodyEmpty14.default)($await_3, 'always'), _bodyEmpty6 = (0, _slicedToArray3.default)(_bodyEmpty5, 1);
			actual = _bodyEmpty6[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with body should fail for empty keyword', t => new Promise(function ($return, $error) {
	var _bodyEmpty7, _bodyEmpty8, actual, expected;

	return Promise.resolve(parsed.filled).then(function ($await_4) {
		try {
			_bodyEmpty7 = (0, _bodyEmpty14.default)($await_4), _bodyEmpty8 = (0, _slicedToArray3.default)(_bodyEmpty7, 1);
			actual = _bodyEmpty8[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with body should succeed for "never"', t => new Promise(function ($return, $error) {
	var _bodyEmpty9, _bodyEmpty10, actual, expected;

	return Promise.resolve(parsed.filled).then(function ($await_5) {
		try {
			_bodyEmpty9 = (0, _bodyEmpty14.default)($await_5, 'never'), _bodyEmpty10 = (0, _slicedToArray3.default)(_bodyEmpty9, 1);
			actual = _bodyEmpty10[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with body should fail for "always"', t => new Promise(function ($return, $error) {
	var _bodyEmpty11, _bodyEmpty12, actual, expected;

	return Promise.resolve(parsed.filled).then(function ($await_6) {
		try {
			_bodyEmpty11 = (0, _bodyEmpty14.default)($await_6, 'always'), _bodyEmpty12 = (0, _slicedToArray3.default)(_bodyEmpty11, 1);
			actual = _bodyEmpty12[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));
//# sourceMappingURL=body-empty.test.js.map