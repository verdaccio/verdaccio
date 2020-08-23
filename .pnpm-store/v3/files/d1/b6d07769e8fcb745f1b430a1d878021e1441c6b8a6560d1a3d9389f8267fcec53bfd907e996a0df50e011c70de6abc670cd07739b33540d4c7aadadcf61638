'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _parse = require('@commitlint/parse');

var _parse2 = _interopRequireDefault(_parse);

var _subjectFullStop = require('./subject-full-stop');

var _subjectFullStop2 = _interopRequireDefault(_subjectFullStop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const messages = {
	empty: 'test:\n',
	with: `test: subject.\n`,
	without: `test: subject\n`
};

const parsed = {
	empty: (0, _parse2.default)(messages.empty),
	with: (0, _parse2.default)(messages.with),
	without: (0, _parse2.default)(messages.without)
};

(0, _ava2.default)('empty against "always" should succeed', t => new Promise(function ($return, $error) {
	var _check, _check2, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_1) {
		try {
			_check = (0, _subjectFullStop2.default)($await_1, 'always', '.'), _check2 = (0, _slicedToArray3.default)(_check, 1);
			actual = _check2[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('empty against "never ." should succeed', t => new Promise(function ($return, $error) {
	var _check3, _check4, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_2) {
		try {
			_check3 = (0, _subjectFullStop2.default)($await_2, 'never', '.'), _check4 = (0, _slicedToArray3.default)(_check3, 1);
			actual = _check4[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with against "always ." should succeed', t => new Promise(function ($return, $error) {
	var _check5, _check6, actual, expected;

	return Promise.resolve(parsed.with).then(function ($await_3) {
		try {
			_check5 = (0, _subjectFullStop2.default)($await_3, 'always', '.'), _check6 = (0, _slicedToArray3.default)(_check5, 1);
			actual = _check6[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with against "never ." should fail', t => new Promise(function ($return, $error) {
	var _check7, _check8, actual, expected;

	return Promise.resolve(parsed.with).then(function ($await_4) {
		try {
			_check7 = (0, _subjectFullStop2.default)($await_4, 'never', '.'), _check8 = (0, _slicedToArray3.default)(_check7, 1);
			actual = _check8[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('without against "always ." should fail', t => new Promise(function ($return, $error) {
	var _check9, _check10, actual, expected;

	return Promise.resolve(parsed.without).then(function ($await_5) {
		try {
			_check9 = (0, _subjectFullStop2.default)($await_5, 'always', '.'), _check10 = (0, _slicedToArray3.default)(_check9, 1);
			actual = _check10[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('without against "never ." should succeed', t => new Promise(function ($return, $error) {
	var _check11, _check12, actual, expected;

	return Promise.resolve(parsed.without).then(function ($await_6) {
		try {
			_check11 = (0, _subjectFullStop2.default)($await_6, 'never', '.'), _check12 = (0, _slicedToArray3.default)(_check11, 1);
			actual = _check12[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));
//# sourceMappingURL=subject-full-stop.test.js.map