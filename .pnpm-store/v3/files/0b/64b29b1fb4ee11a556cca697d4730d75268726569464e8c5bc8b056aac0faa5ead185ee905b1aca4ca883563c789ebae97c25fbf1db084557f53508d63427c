'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _parse = require('@commitlint/parse');

var _parse2 = _interopRequireDefault(_parse);

var _signedOffBy = require('./signed-off-by');

var _signedOffBy2 = _interopRequireDefault(_signedOffBy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const messages = {
	empty: 'test:\n',
	with: `test: subject\nbody\nfooter\nSigned-off-by:\n\n`,
	without: `test: subject\nbody\nfooter\n\n`,
	inSubject: `test: subject Signed-off-by:\nbody\nfooter\n\n`,
	inBody: `test: subject\nbody Signed-off-by:\nfooter\n\n`
};

const parsed = {
	empty: (0, _parse2.default)(messages.empty),
	with: (0, _parse2.default)(messages.with),
	without: (0, _parse2.default)(messages.without),
	inSubject: (0, _parse2.default)(messages.inSubject),
	inBody: (0, _parse2.default)(messages.inBody)
};

(0, _ava2.default)('empty against "always signed-off-by" should fail', t => new Promise(function ($return, $error) {
	var _check, _check2, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_1) {
		try {
			_check = (0, _signedOffBy2.default)($await_1, 'always', 'Signed-off-by:'), _check2 = (0, _slicedToArray3.default)(_check, 1);
			actual = _check2[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('empty against "never signed-off-by" should succeed', t => new Promise(function ($return, $error) {
	var _check3, _check4, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_2) {
		try {
			_check3 = (0, _signedOffBy2.default)($await_2, 'never', 'Signed-off-by:'), _check4 = (0, _slicedToArray3.default)(_check3, 1);
			actual = _check4[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with against "always signed-off-by" should succeed', t => new Promise(function ($return, $error) {
	var _check5, _check6, actual, expected;

	return Promise.resolve(parsed.with).then(function ($await_3) {
		try {
			_check5 = (0, _signedOffBy2.default)($await_3, 'always', 'Signed-off-by:'), _check6 = (0, _slicedToArray3.default)(_check5, 1);
			actual = _check6[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with against "never signed-off-by" should fail', t => new Promise(function ($return, $error) {
	var _check7, _check8, actual, expected;

	return Promise.resolve(parsed.with).then(function ($await_4) {
		try {
			_check7 = (0, _signedOffBy2.default)($await_4, 'never', 'Signed-off-by:'), _check8 = (0, _slicedToArray3.default)(_check7, 1);
			actual = _check8[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('without against "always signed-off-by" should fail', t => new Promise(function ($return, $error) {
	var _check9, _check10, actual, expected;

	return Promise.resolve(parsed.without).then(function ($await_5) {
		try {
			_check9 = (0, _signedOffBy2.default)($await_5, 'always', 'Signed-off-by:'), _check10 = (0, _slicedToArray3.default)(_check9, 1);
			actual = _check10[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('without against "never signed-off-by" should succeed', t => new Promise(function ($return, $error) {
	var _check11, _check12, actual, expected;

	return Promise.resolve(parsed.without).then(function ($await_6) {
		try {
			_check11 = (0, _signedOffBy2.default)($await_6, 'never', 'Signed-off-by:'), _check12 = (0, _slicedToArray3.default)(_check11, 1);
			actual = _check12[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('inSubject against "always signed-off-by" should fail', t => new Promise(function ($return, $error) {
	var _check13, _check14, actual, expected;

	return Promise.resolve(parsed.inSubject).then(function ($await_7) {
		try {
			_check13 = (0, _signedOffBy2.default)($await_7, 'always', 'Signed-off-by:'), _check14 = (0, _slicedToArray3.default)(_check13, 1);
			actual = _check14[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('inSubject against "never signed-off-by" should succeed', t => new Promise(function ($return, $error) {
	var _check15, _check16, actual, expected;

	return Promise.resolve(parsed.inSubject).then(function ($await_8) {
		try {
			_check15 = (0, _signedOffBy2.default)($await_8, 'never', 'Signed-off-by:'), _check16 = (0, _slicedToArray3.default)(_check15, 1);
			actual = _check16[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('inBody against "always signed-off-by" should fail', t => new Promise(function ($return, $error) {
	var _check17, _check18, actual, expected;

	return Promise.resolve(parsed.inBody).then(function ($await_9) {
		try {
			_check17 = (0, _signedOffBy2.default)($await_9, 'always', 'Signed-off-by:'), _check18 = (0, _slicedToArray3.default)(_check17, 1);
			actual = _check18[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('inBody against "never signed-off-by" should succeed', t => new Promise(function ($return, $error) {
	var _check19, _check20, actual, expected;

	return Promise.resolve(parsed.inBody).then(function ($await_10) {
		try {
			_check19 = (0, _signedOffBy2.default)($await_10, 'never', 'Signed-off-by:'), _check20 = (0, _slicedToArray3.default)(_check19, 1);
			actual = _check20[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));
//# sourceMappingURL=signed-off-by.test.js.map