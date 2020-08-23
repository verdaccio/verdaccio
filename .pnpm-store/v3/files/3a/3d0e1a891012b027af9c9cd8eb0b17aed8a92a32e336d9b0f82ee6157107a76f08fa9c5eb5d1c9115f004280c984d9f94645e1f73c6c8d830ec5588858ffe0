'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _parse = require('@commitlint/parse');

var _parse2 = _interopRequireDefault(_parse);

var _footerMaxLineLength = require('./footer-max-line-length');

var _footerMaxLineLength2 = _interopRequireDefault(_footerMaxLineLength);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const short = 'BREAKING CHANGE: a';
const long = 'BREAKING CHANGE: ab';

const value = short.length;

const messages = {
	simple: 'test: subject',
	empty: 'test: subject\nbody',
	short: `test: subject\n${short}`,
	long: `test: subject\n${long}`,
	shortMultipleLines: `test:subject\n${short}\n${short}\n${short}`,
	longMultipleLines: `test:subject\n${short}\n${long}\n${short}`
};

const parsed = {
	simple: (0, _parse2.default)(messages.simple),
	empty: (0, _parse2.default)(messages.empty),
	short: (0, _parse2.default)(messages.short),
	long: (0, _parse2.default)(messages.long)
};

(0, _ava2.default)('with simple should succeed', t => new Promise(function ($return, $error) {
	var _check, _check2, actual, expected;

	return Promise.resolve(parsed.simple).then(function ($await_1) {
		try {
			_check = (0, _footerMaxLineLength2.default)($await_1, '', value), _check2 = (0, _slicedToArray3.default)(_check, 1);
			actual = _check2[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty should succeed', t => new Promise(function ($return, $error) {
	var _check3, _check4, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_2) {
		try {
			_check3 = (0, _footerMaxLineLength2.default)($await_2, '', value), _check4 = (0, _slicedToArray3.default)(_check3, 1);
			actual = _check4[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with short should succeed', t => new Promise(function ($return, $error) {
	var _check5, _check6, actual, expected;

	return Promise.resolve(parsed.short).then(function ($await_3) {
		try {
			_check5 = (0, _footerMaxLineLength2.default)($await_3, '', value), _check6 = (0, _slicedToArray3.default)(_check5, 1);
			actual = _check6[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with long should fail', t => new Promise(function ($return, $error) {
	var _check7, _check8, actual, expected;

	return Promise.resolve(parsed.long).then(function ($await_4) {
		try {
			_check7 = (0, _footerMaxLineLength2.default)($await_4, '', value), _check8 = (0, _slicedToArray3.default)(_check7, 1);
			actual = _check8[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with short with multiple lines should succeed', t => new Promise(function ($return, $error) {
	var _check9, _check10, actual, expected;

	return Promise.resolve(parsed.short).then(function ($await_5) {
		try {
			_check9 = (0, _footerMaxLineLength2.default)($await_5, '', value), _check10 = (0, _slicedToArray3.default)(_check9, 1);
			actual = _check10[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with long with multiple lines should fail', t => new Promise(function ($return, $error) {
	var _check11, _check12, actual, expected;

	return Promise.resolve(parsed.long).then(function ($await_6) {
		try {
			_check11 = (0, _footerMaxLineLength2.default)($await_6, '', value), _check12 = (0, _slicedToArray3.default)(_check11, 1);
			actual = _check12[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));
//# sourceMappingURL=footer-max-line-length.test.js.map