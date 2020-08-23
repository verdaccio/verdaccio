'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _parse = require('@commitlint/parse');

var _parse2 = _interopRequireDefault(_parse);

var _subjectEmpty13 = require('./subject-empty');

var _subjectEmpty14 = _interopRequireDefault(_subjectEmpty13);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const messages = {
	empty: 'test: \nbody',
	filled: 'test: subject\nbody'
};

const parsed = {
	empty: (0, _parse2.default)(messages.empty),
	filled: (0, _parse2.default)(messages.filled)
};

(0, _ava2.default)('without subject should succeed for empty keyword', t => new Promise(function ($return, $error) {
	var _subjectEmpty, _subjectEmpty2, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_1) {
		try {
			_subjectEmpty = (0, _subjectEmpty14.default)($await_1), _subjectEmpty2 = (0, _slicedToArray3.default)(_subjectEmpty, 1);
			actual = _subjectEmpty2[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('without subject should fail for "never"', t => new Promise(function ($return, $error) {
	var _subjectEmpty3, _subjectEmpty4, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_2) {
		try {
			_subjectEmpty3 = (0, _subjectEmpty14.default)($await_2, 'never'), _subjectEmpty4 = (0, _slicedToArray3.default)(_subjectEmpty3, 1);
			actual = _subjectEmpty4[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('without subject should succeed for "always"', t => new Promise(function ($return, $error) {
	var _subjectEmpty5, _subjectEmpty6, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_3) {
		try {
			_subjectEmpty5 = (0, _subjectEmpty14.default)($await_3, 'always'), _subjectEmpty6 = (0, _slicedToArray3.default)(_subjectEmpty5, 1);
			actual = _subjectEmpty6[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with subject fail for empty keyword', t => new Promise(function ($return, $error) {
	var _subjectEmpty7, _subjectEmpty8, actual, expected;

	return Promise.resolve(parsed.filled).then(function ($await_4) {
		try {
			_subjectEmpty7 = (0, _subjectEmpty14.default)($await_4), _subjectEmpty8 = (0, _slicedToArray3.default)(_subjectEmpty7, 1);
			actual = _subjectEmpty8[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with subject succeed for "never"', t => new Promise(function ($return, $error) {
	var _subjectEmpty9, _subjectEmpty10, actual, expected;

	return Promise.resolve(parsed.filled).then(function ($await_5) {
		try {
			_subjectEmpty9 = (0, _subjectEmpty14.default)($await_5, 'never'), _subjectEmpty10 = (0, _slicedToArray3.default)(_subjectEmpty9, 1);
			actual = _subjectEmpty10[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with subject fail for "always"', t => new Promise(function ($return, $error) {
	var _subjectEmpty11, _subjectEmpty12, actual, expected;

	return Promise.resolve(parsed.filled).then(function ($await_6) {
		try {
			_subjectEmpty11 = (0, _subjectEmpty14.default)($await_6, 'always'), _subjectEmpty12 = (0, _slicedToArray3.default)(_subjectEmpty11, 1);
			actual = _subjectEmpty12[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));
//# sourceMappingURL=subject-empty.test.js.map