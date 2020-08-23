'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _parse = require('@commitlint/parse');

var _parse2 = _interopRequireDefault(_parse);

var _scopeEnum27 = require('./scope-enum');

var _scopeEnum28 = _interopRequireDefault(_scopeEnum27);

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

(0, _ava2.default)('scope-enum with plain message and always should succeed empty enum', t => new Promise(function ($return, $error) {
	var _scopeEnum, _scopeEnum2, actual, expected;

	return Promise.resolve(parsed.plain).then(function ($await_1) {
		try {
			_scopeEnum = (0, _scopeEnum28.default)($await_1, 'always', []), _scopeEnum2 = (0, _slicedToArray3.default)(_scopeEnum, 1);
			actual = _scopeEnum2[0];
			expected = true;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('scope-enum with plain message and never should error empty enum', t => new Promise(function ($return, $error) {
	var _scopeEnum3, _scopeEnum4, actual, expected;

	return Promise.resolve(parsed.plain).then(function ($await_2) {
		try {
			_scopeEnum3 = (0, _scopeEnum28.default)($await_2, 'never', []), _scopeEnum4 = (0, _slicedToArray3.default)(_scopeEnum3, 1);
			actual = _scopeEnum4[0];
			expected = false;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with plain message should succeed correct enum', t => new Promise(function ($return, $error) {
	var _scopeEnum5, _scopeEnum6, actual, expected;

	return Promise.resolve(parsed.plain).then(function ($await_3) {
		try {
			_scopeEnum5 = (0, _scopeEnum28.default)($await_3, 'always', ['bar']), _scopeEnum6 = (0, _slicedToArray3.default)(_scopeEnum5, 1);
			actual = _scopeEnum6[0];
			expected = true;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('scope-enum with plain message should error false enum', t => new Promise(function ($return, $error) {
	var _scopeEnum7, _scopeEnum8, actual, expected;

	return Promise.resolve(parsed.plain).then(function ($await_4) {
		try {
			_scopeEnum7 = (0, _scopeEnum28.default)($await_4, 'always', ['foo']), _scopeEnum8 = (0, _slicedToArray3.default)(_scopeEnum7, 1);
			actual = _scopeEnum8[0];
			expected = false;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('scope-enum with plain message should error forbidden enum', t => new Promise(function ($return, $error) {
	var _scopeEnum9, _scopeEnum10, actual, expected;

	return Promise.resolve(parsed.plain).then(function ($await_5) {
		try {
			_scopeEnum9 = (0, _scopeEnum28.default)($await_5, 'never', ['bar']), _scopeEnum10 = (0, _slicedToArray3.default)(_scopeEnum9, 1);
			actual = _scopeEnum10[0];
			expected = false;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('scope-enum with plain message should succeed forbidden enum', t => new Promise(function ($return, $error) {
	var _scopeEnum11, _scopeEnum12, actual, expected;

	return Promise.resolve(parsed.plain).then(function ($await_6) {
		try {
			_scopeEnum11 = (0, _scopeEnum28.default)($await_6, 'never', ['foo']), _scopeEnum12 = (0, _slicedToArray3.default)(_scopeEnum11, 1);
			actual = _scopeEnum12[0];
			expected = true;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('scope-enum with superfluous scope should succeed enum', t => new Promise(function ($return, $error) {
	var _scopeEnum13, _scopeEnum14, actual, expected;

	return Promise.resolve(parsed.superfluous).then(function ($await_7) {
		try {
			_scopeEnum13 = (0, _scopeEnum28.default)($await_7, 'always', ['bar']), _scopeEnum14 = (0, _slicedToArray3.default)(_scopeEnum13, 1);
			actual = _scopeEnum14[0];
			expected = true;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('scope-enum with superfluous scope and "never" should succeed', t => new Promise(function ($return, $error) {
	var _scopeEnum15, _scopeEnum16, actual, expected;

	return Promise.resolve(parsed.superfluous).then(function ($await_8) {
		try {
			_scopeEnum15 = (0, _scopeEnum28.default)($await_8, 'never', ['bar']), _scopeEnum16 = (0, _slicedToArray3.default)(_scopeEnum15, 1);
			actual = _scopeEnum16[0];
			expected = true;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('scope-enum with superfluous scope and always should succeed empty enum', t => new Promise(function ($return, $error) {
	var _scopeEnum17, _scopeEnum18, actual, expected;

	return Promise.resolve(parsed.superfluous).then(function ($await_9) {
		try {
			_scopeEnum17 = (0, _scopeEnum28.default)($await_9, 'always', []), _scopeEnum18 = (0, _slicedToArray3.default)(_scopeEnum17, 1);
			actual = _scopeEnum18[0];
			expected = true;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('scope-enum with superfluous scope and never should succeed empty enum', t => new Promise(function ($return, $error) {
	var _scopeEnum19, _scopeEnum20, actual, expected;

	return Promise.resolve(parsed.superfluous).then(function ($await_10) {
		try {
			_scopeEnum19 = (0, _scopeEnum28.default)($await_10, 'never', []), _scopeEnum20 = (0, _slicedToArray3.default)(_scopeEnum19, 1);
			actual = _scopeEnum20[0];
			expected = true;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('scope-enum with empty scope and always should succeed empty enum', t => new Promise(function ($return, $error) {
	var _scopeEnum21, _scopeEnum22, actual, expected;

	return Promise.resolve(parsed.superfluous).then(function ($await_11) {
		try {
			_scopeEnum21 = (0, _scopeEnum28.default)($await_11, 'always', []), _scopeEnum22 = (0, _slicedToArray3.default)(_scopeEnum21, 1);
			actual = _scopeEnum22[0];
			expected = true;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('scope-enum with empty scope and always should succeed filled enum', t => new Promise(function ($return, $error) {
	var _scopeEnum23, _scopeEnum24, actual, expected;

	return Promise.resolve(parsed.superfluous).then(function ($await_12) {
		try {
			_scopeEnum23 = (0, _scopeEnum28.default)($await_12, 'always', ['foo']), _scopeEnum24 = (0, _slicedToArray3.default)(_scopeEnum23, 1);
			actual = _scopeEnum24[0];
			expected = true;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('scope-enum with empty scope and never should succeed empty enum', t => new Promise(function ($return, $error) {
	var _scopeEnum25, _scopeEnum26, actual, expected;

	return Promise.resolve(parsed.superfluous).then(function ($await_13) {
		try {
			_scopeEnum25 = (0, _scopeEnum28.default)($await_13, 'never', []), _scopeEnum26 = (0, _slicedToArray3.default)(_scopeEnum25, 1);
			actual = _scopeEnum26[0];
			expected = true;

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));
//# sourceMappingURL=scope-enum.test.js.map