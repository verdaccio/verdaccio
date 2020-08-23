'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _parse = require('@commitlint/parse');

var _parse2 = _interopRequireDefault(_parse);

var _scopeMaxLength = require('./scope-max-length');

var _scopeMaxLength2 = _interopRequireDefault(_scopeMaxLength);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const short = 'a';
const long = 'ab';

const value = short.length;

const messages = {
	empty: 'test: \n',
	short: `test(${short}): \n`,
	long: `test(${long}): \n`
};

const parsed = {
	empty: (0, _parse2.default)(messages.empty),
	short: (0, _parse2.default)(messages.short),
	long: (0, _parse2.default)(messages.long)
};

(0, _ava2.default)('with empty should succeed', t => new Promise(function ($return, $error) {
	var _check, _check2, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_1) {
		try {
			_check = (0, _scopeMaxLength2.default)($await_1, '', value), _check2 = (0, _slicedToArray3.default)(_check, 1);
			actual = _check2[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with short should succeed', t => new Promise(function ($return, $error) {
	var _check3, _check4, actual, expected;

	return Promise.resolve(parsed.short).then(function ($await_2) {
		try {
			_check3 = (0, _scopeMaxLength2.default)($await_2, '', value), _check4 = (0, _slicedToArray3.default)(_check3, 1);
			actual = _check4[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with long should fail', t => new Promise(function ($return, $error) {
	var _check5, _check6, actual, expected;

	return Promise.resolve(parsed.long).then(function ($await_3) {
		try {
			_check5 = (0, _scopeMaxLength2.default)($await_3, '', value), _check6 = (0, _slicedToArray3.default)(_check5, 1);
			actual = _check6[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));
//# sourceMappingURL=scope-max-length.test.js.map