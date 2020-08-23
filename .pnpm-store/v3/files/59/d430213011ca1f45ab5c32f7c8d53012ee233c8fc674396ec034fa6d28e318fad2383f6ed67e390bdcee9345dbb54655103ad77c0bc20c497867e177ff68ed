'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _parse = require('@commitlint/parse');

var _parse2 = _interopRequireDefault(_parse);

var _bodyCase25 = require('./body-case');

var _bodyCase26 = _interopRequireDefault(_bodyCase25);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const messages = {
	empty: 'test: subject',
	lowercase: 'test: subject\nbody',
	mixedcase: 'test: subject\nBody',
	uppercase: 'test: subject\nBODY'
};

const parsed = {
	empty: (0, _parse2.default)(messages.empty),
	lowercase: (0, _parse2.default)(messages.lowercase),
	mixedcase: (0, _parse2.default)(messages.mixedcase),
	uppercase: (0, _parse2.default)(messages.uppercase)
};

(0, _ava2.default)('with empty body should succeed for "never lowercase"', t => new Promise(function ($return, $error) {
	var _bodyCase, _bodyCase2, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_1) {
		try {
			_bodyCase = (0, _bodyCase26.default)($await_1, 'never', 'lowercase'), _bodyCase2 = (0, _slicedToArray3.default)(_bodyCase, 1);
			actual = _bodyCase2[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty body should succeed for "always lowercase"', t => new Promise(function ($return, $error) {
	var _bodyCase3, _bodyCase4, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_2) {
		try {
			_bodyCase3 = (0, _bodyCase26.default)($await_2, 'always', 'lowercase'), _bodyCase4 = (0, _slicedToArray3.default)(_bodyCase3, 1);
			actual = _bodyCase4[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty body should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _bodyCase5, _bodyCase6, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_3) {
		try {
			_bodyCase5 = (0, _bodyCase26.default)($await_3, 'never', 'uppercase'), _bodyCase6 = (0, _slicedToArray3.default)(_bodyCase5, 1);
			actual = _bodyCase6[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty body should succeed for "always uppercase"', t => new Promise(function ($return, $error) {
	var _bodyCase7, _bodyCase8, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_4) {
		try {
			_bodyCase7 = (0, _bodyCase26.default)($await_4, 'always', 'uppercase'), _bodyCase8 = (0, _slicedToArray3.default)(_bodyCase7, 1);
			actual = _bodyCase8[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with lowercase body should fail for "never lowercase"', t => new Promise(function ($return, $error) {
	var _bodyCase9, _bodyCase10, actual, expected;

	return Promise.resolve(parsed.lowercase).then(function ($await_5) {
		try {
			_bodyCase9 = (0, _bodyCase26.default)($await_5, 'never', 'lowercase'), _bodyCase10 = (0, _slicedToArray3.default)(_bodyCase9, 1);
			actual = _bodyCase10[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with lowercase body should succeed for "always lowercase"', t => new Promise(function ($return, $error) {
	var _bodyCase11, _bodyCase12, actual, expected;

	return Promise.resolve(parsed.lowercase).then(function ($await_6) {
		try {
			_bodyCase11 = (0, _bodyCase26.default)($await_6, 'always', 'lowercase'), _bodyCase12 = (0, _slicedToArray3.default)(_bodyCase11, 1);
			actual = _bodyCase12[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase body should succeed for "never lowercase"', t => new Promise(function ($return, $error) {
	var _bodyCase13, _bodyCase14, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_7) {
		try {
			_bodyCase13 = (0, _bodyCase26.default)($await_7, 'never', 'lowercase'), _bodyCase14 = (0, _slicedToArray3.default)(_bodyCase13, 1);
			actual = _bodyCase14[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase body should fail for "always lowercase"', t => new Promise(function ($return, $error) {
	var _bodyCase15, _bodyCase16, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_8) {
		try {
			_bodyCase15 = (0, _bodyCase26.default)($await_8, 'always', 'lowercase'), _bodyCase16 = (0, _slicedToArray3.default)(_bodyCase15, 1);
			actual = _bodyCase16[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase body should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _bodyCase17, _bodyCase18, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_9) {
		try {
			_bodyCase17 = (0, _bodyCase26.default)($await_9, 'never', 'uppercase'), _bodyCase18 = (0, _slicedToArray3.default)(_bodyCase17, 1);
			actual = _bodyCase18[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase body should fail for "always uppercase"', t => new Promise(function ($return, $error) {
	var _bodyCase19, _bodyCase20, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_10) {
		try {
			_bodyCase19 = (0, _bodyCase26.default)($await_10, 'always', 'uppercase'), _bodyCase20 = (0, _slicedToArray3.default)(_bodyCase19, 1);
			actual = _bodyCase20[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with uppercase body should fail for "never uppercase"', t => new Promise(function ($return, $error) {
	var _bodyCase21, _bodyCase22, actual, expected;

	return Promise.resolve(parsed.uppercase).then(function ($await_11) {
		try {
			_bodyCase21 = (0, _bodyCase26.default)($await_11, 'never', 'uppercase'), _bodyCase22 = (0, _slicedToArray3.default)(_bodyCase21, 1);
			actual = _bodyCase22[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with lowercase body should succeed for "always uppercase"', t => new Promise(function ($return, $error) {
	var _bodyCase23, _bodyCase24, actual, expected;

	return Promise.resolve(parsed.uppercase).then(function ($await_12) {
		try {
			_bodyCase23 = (0, _bodyCase26.default)($await_12, 'always', 'uppercase'), _bodyCase24 = (0, _slicedToArray3.default)(_bodyCase23, 1);
			actual = _bodyCase24[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));
//# sourceMappingURL=body-case.test.js.map