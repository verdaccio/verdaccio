'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _parse = require('@commitlint/parse');

var _parse2 = _interopRequireDefault(_parse);

var _typeEnum = require('./type-enum');

var _typeEnum2 = _interopRequireDefault(_typeEnum);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const messages = {
	empty: '(): \n',
	a: 'a(): \n',
	b: 'b(): \n'
};

const parsed = {
	empty: (0, _parse2.default)(messages.empty),
	a: (0, _parse2.default)(messages.a),
	b: (0, _parse2.default)(messages.b)
};

(0, _ava2.default)('empty succeeds', t => new Promise(function ($return, $error) {
	var _check, _check2, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_1) {
		try {
			_check = (0, _typeEnum2.default)($await_1), _check2 = (0, _slicedToArray3.default)(_check, 1);
			actual = _check2[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('empty on "a" succeeds', t => new Promise(function ($return, $error) {
	var _check3, _check4, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_2) {
		try {
			_check3 = (0, _typeEnum2.default)($await_2, '', ['a']), _check4 = (0, _slicedToArray3.default)(_check3, 1);
			actual = _check4[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('empty on "always a" succeeds', t => new Promise(function ($return, $error) {
	var _check5, _check6, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_3) {
		try {
			_check5 = (0, _typeEnum2.default)($await_3, 'always', ['a']), _check6 = (0, _slicedToArray3.default)(_check5, 1);
			actual = _check6[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('empty on "never a" succeeds', t => new Promise(function ($return, $error) {
	var _check7, _check8, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_4) {
		try {
			_check7 = (0, _typeEnum2.default)($await_4, 'never', ['a']), _check8 = (0, _slicedToArray3.default)(_check7, 1);
			actual = _check8[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('empty on "always a, b" succeeds', t => new Promise(function ($return, $error) {
	var _check9, _check10, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_5) {
		try {
			_check9 = (0, _typeEnum2.default)($await_5, 'always', ['a', 'b']), _check10 = (0, _slicedToArray3.default)(_check9, 1);
			actual = _check10[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('empty on "never a, b" succeeds', t => new Promise(function ($return, $error) {
	var _check11, _check12, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_6) {
		try {
			_check11 = (0, _typeEnum2.default)($await_6, 'neber', ['a', 'b']), _check12 = (0, _slicedToArray3.default)(_check11, 1);
			actual = _check12[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('a on "a" succeeds', t => new Promise(function ($return, $error) {
	var _check13, _check14, actual, expected;

	return Promise.resolve(parsed.a).then(function ($await_7) {
		try {
			_check13 = (0, _typeEnum2.default)($await_7, '', ['a']), _check14 = (0, _slicedToArray3.default)(_check13, 1);
			actual = _check14[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('a on "always a" succeeds', t => new Promise(function ($return, $error) {
	var _check15, _check16, actual, expected;

	return Promise.resolve(parsed.a).then(function ($await_8) {
		try {
			_check15 = (0, _typeEnum2.default)($await_8, 'always', ['a']), _check16 = (0, _slicedToArray3.default)(_check15, 1);
			actual = _check16[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('a on "never a" fails', t => new Promise(function ($return, $error) {
	var _check17, _check18, actual, expected;

	return Promise.resolve(parsed.a).then(function ($await_9) {
		try {
			_check17 = (0, _typeEnum2.default)($await_9, 'never', ['a']), _check18 = (0, _slicedToArray3.default)(_check17, 1);
			actual = _check18[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('b on "b" succeeds', t => new Promise(function ($return, $error) {
	var _check19, _check20, actual, expected;

	return Promise.resolve(parsed.b).then(function ($await_10) {
		try {
			_check19 = (0, _typeEnum2.default)($await_10, '', ['b']), _check20 = (0, _slicedToArray3.default)(_check19, 1);
			actual = _check20[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('b on "always b" succeeds', t => new Promise(function ($return, $error) {
	var _check21, _check22, actual, expected;

	return Promise.resolve(parsed.b).then(function ($await_11) {
		try {
			_check21 = (0, _typeEnum2.default)($await_11, 'always', ['b']), _check22 = (0, _slicedToArray3.default)(_check21, 1);
			actual = _check22[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('b on "never b" fails', t => new Promise(function ($return, $error) {
	var _check23, _check24, actual, expected;

	return Promise.resolve(parsed.b).then(function ($await_12) {
		try {
			_check23 = (0, _typeEnum2.default)($await_12, 'never', ['b']), _check24 = (0, _slicedToArray3.default)(_check23, 1);
			actual = _check24[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('a on "a, b" succeeds', t => new Promise(function ($return, $error) {
	var _check25, _check26, actual, expected;

	return Promise.resolve(parsed.a).then(function ($await_13) {
		try {
			_check25 = (0, _typeEnum2.default)($await_13, '', ['a', 'b']), _check26 = (0, _slicedToArray3.default)(_check25, 1);
			actual = _check26[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('a on "always a, b" succeeds', t => new Promise(function ($return, $error) {
	var _check27, _check28, actual, expected;

	return Promise.resolve(parsed.a).then(function ($await_14) {
		try {
			_check27 = (0, _typeEnum2.default)($await_14, 'always', ['a', 'b']), _check28 = (0, _slicedToArray3.default)(_check27, 1);
			actual = _check28[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('a on "never a, b" fails', t => new Promise(function ($return, $error) {
	var _check29, _check30, actual, expected;

	return Promise.resolve(parsed.a).then(function ($await_15) {
		try {
			_check29 = (0, _typeEnum2.default)($await_15, 'never', ['a', 'b']), _check30 = (0, _slicedToArray3.default)(_check29, 1);
			actual = _check30[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('b on "a, b" succeeds', t => new Promise(function ($return, $error) {
	var _check31, _check32, actual, expected;

	return Promise.resolve(parsed.b).then(function ($await_16) {
		try {
			_check31 = (0, _typeEnum2.default)($await_16, '', ['a', 'b']), _check32 = (0, _slicedToArray3.default)(_check31, 1);
			actual = _check32[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('b on "always a, b" succeeds', t => new Promise(function ($return, $error) {
	var _check33, _check34, actual, expected;

	return Promise.resolve(parsed.b).then(function ($await_17) {
		try {
			_check33 = (0, _typeEnum2.default)($await_17, 'always', ['a', 'b']), _check34 = (0, _slicedToArray3.default)(_check33, 1);
			actual = _check34[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('b on "never a, b" fails', t => new Promise(function ($return, $error) {
	var _check35, _check36, actual, expected;

	return Promise.resolve(parsed.b).then(function ($await_18) {
		try {
			_check35 = (0, _typeEnum2.default)($await_18, 'never', ['a', 'b']), _check36 = (0, _slicedToArray3.default)(_check35, 1);
			actual = _check36[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));
//# sourceMappingURL=type-enum.test.js.map