'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _parse = require('@commitlint/parse');

var _parse2 = _interopRequireDefault(_parse);

var _footerLeadingBlank45 = require('./footer-leading-blank');

var _footerLeadingBlank46 = _interopRequireDefault(_footerLeadingBlank45);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const messages = {
	simple: 'test: subject',
	body: 'test: subject\nbody',
	trailing: 'test: subject\nbody\n\n',
	without: 'test: subject\nbody\nBREAKING CHANGE: something important',
	withoutBody: 'feat(new-parser): introduces a new parsing library\n\nBREAKING CHANGE: new library does not support foo-construct',
	with: 'test: subject\nbody\n\nBREAKING CHANGE: something important',
	withMulitLine: 'test: subject\nmulti\nline\nbody\n\nBREAKING CHANGE: something important',
	withDoubleNewLine: 'fix: some issue\n\ndetailed explanation\n\ncloses #123'
};

const parsed = {
	simple: (0, _parse2.default)(messages.simple),
	body: (0, _parse2.default)(messages.body),
	trailing: (0, _parse2.default)(messages.trailing),
	without: (0, _parse2.default)(messages.without),
	withoutBody: (0, _parse2.default)(messages.withoutBody),
	with: (0, _parse2.default)(messages.with),
	withMulitLine: (0, _parse2.default)(messages.withMulitLine),
	withDoubleNewLine: (0, _parse2.default)(messages.withDoubleNewLine)
};

(0, _ava2.default)('with simple message should succeed for empty keyword', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank, _footerLeadingBlank2, actual, expected;

	return Promise.resolve(parsed.simple).then(function ($await_1) {
		try {
			_footerLeadingBlank = (0, _footerLeadingBlank46.default)($await_1), _footerLeadingBlank2 = (0, _slicedToArray3.default)(_footerLeadingBlank, 1);
			actual = _footerLeadingBlank2[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with simple message should succeed for "never"', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank3, _footerLeadingBlank4, actual, expected;

	return Promise.resolve(parsed.simple).then(function ($await_2) {
		try {
			_footerLeadingBlank3 = (0, _footerLeadingBlank46.default)($await_2, 'never'), _footerLeadingBlank4 = (0, _slicedToArray3.default)(_footerLeadingBlank3, 1);
			actual = _footerLeadingBlank4[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with simple message should succeed for "always"', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank5, _footerLeadingBlank6, actual, expected;

	return Promise.resolve(parsed.simple).then(function ($await_3) {
		try {
			_footerLeadingBlank5 = (0, _footerLeadingBlank46.default)($await_3, 'always'), _footerLeadingBlank6 = (0, _slicedToArray3.default)(_footerLeadingBlank5, 1);
			actual = _footerLeadingBlank6[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with body message should succeed for empty keyword', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank7, _footerLeadingBlank8, actual, expected;

	return Promise.resolve(parsed.body).then(function ($await_4) {
		try {
			_footerLeadingBlank7 = (0, _footerLeadingBlank46.default)($await_4), _footerLeadingBlank8 = (0, _slicedToArray3.default)(_footerLeadingBlank7, 1);
			actual = _footerLeadingBlank8[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with body message should succeed for "never"', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank9, _footerLeadingBlank10, actual, expected;

	return Promise.resolve(parsed.body).then(function ($await_5) {
		try {
			_footerLeadingBlank9 = (0, _footerLeadingBlank46.default)($await_5, 'never'), _footerLeadingBlank10 = (0, _slicedToArray3.default)(_footerLeadingBlank9, 1);
			actual = _footerLeadingBlank10[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with body message should succeed for "always"', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank11, _footerLeadingBlank12, actual, expected;

	return Promise.resolve(parsed.body).then(function ($await_6) {
		try {
			_footerLeadingBlank11 = (0, _footerLeadingBlank46.default)($await_6, 'always'), _footerLeadingBlank12 = (0, _slicedToArray3.default)(_footerLeadingBlank11, 1);
			actual = _footerLeadingBlank12[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with trailing message should succeed for empty keyword', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank13, _footerLeadingBlank14, actual, expected;

	return Promise.resolve(parsed.trailing).then(function ($await_7) {
		try {
			_footerLeadingBlank13 = (0, _footerLeadingBlank46.default)($await_7), _footerLeadingBlank14 = (0, _slicedToArray3.default)(_footerLeadingBlank13, 1);
			actual = _footerLeadingBlank14[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with trailing message should succeed for "never"', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank15, _footerLeadingBlank16, actual, expected;

	return Promise.resolve(parsed.trailing).then(function ($await_8) {
		try {
			_footerLeadingBlank15 = (0, _footerLeadingBlank46.default)($await_8, 'never'), _footerLeadingBlank16 = (0, _slicedToArray3.default)(_footerLeadingBlank15, 1);
			actual = _footerLeadingBlank16[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with trailing message should succeed for "always"', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank17, _footerLeadingBlank18, actual, expected;

	return Promise.resolve(parsed.trailing).then(function ($await_9) {
		try {
			_footerLeadingBlank17 = (0, _footerLeadingBlank46.default)($await_9, 'always'), _footerLeadingBlank18 = (0, _slicedToArray3.default)(_footerLeadingBlank17, 1);
			actual = _footerLeadingBlank18[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('without body should fail for "never"', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank19, _footerLeadingBlank20, actual, expected;

	return Promise.resolve(parsed.withoutBody).then(function ($await_10) {
		try {
			_footerLeadingBlank19 = (0, _footerLeadingBlank46.default)($await_10, 'never'), _footerLeadingBlank20 = (0, _slicedToArray3.default)(_footerLeadingBlank19, 1);
			actual = _footerLeadingBlank20[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('without body should succeed for "always"', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank21, _footerLeadingBlank22, actual, expected;

	return Promise.resolve(parsed.withoutBody).then(function ($await_11) {
		try {
			_footerLeadingBlank21 = (0, _footerLeadingBlank46.default)($await_11, 'always'), _footerLeadingBlank22 = (0, _slicedToArray3.default)(_footerLeadingBlank21, 1);
			actual = _footerLeadingBlank22[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('without blank line before footer should fail for empty keyword', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank23, _footerLeadingBlank24, actual, expected;

	return Promise.resolve(parsed.without).then(function ($await_12) {
		try {
			_footerLeadingBlank23 = (0, _footerLeadingBlank46.default)($await_12), _footerLeadingBlank24 = (0, _slicedToArray3.default)(_footerLeadingBlank23, 1);
			actual = _footerLeadingBlank24[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('without blank line before footer should succeed for "never"', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank25, _footerLeadingBlank26, actual, expected;

	return Promise.resolve(parsed.without).then(function ($await_13) {
		try {
			_footerLeadingBlank25 = (0, _footerLeadingBlank46.default)($await_13, 'never'), _footerLeadingBlank26 = (0, _slicedToArray3.default)(_footerLeadingBlank25, 1);
			actual = _footerLeadingBlank26[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('without blank line before footer should fail for "always"', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank27, _footerLeadingBlank28, actual, expected;

	return Promise.resolve(parsed.without).then(function ($await_14) {
		try {
			_footerLeadingBlank27 = (0, _footerLeadingBlank46.default)($await_14, 'always'), _footerLeadingBlank28 = (0, _slicedToArray3.default)(_footerLeadingBlank27, 1);
			actual = _footerLeadingBlank28[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with blank line before footer should succeed for empty keyword', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank29, _footerLeadingBlank30, actual, expected;

	return Promise.resolve(parsed.with).then(function ($await_15) {
		try {
			_footerLeadingBlank29 = (0, _footerLeadingBlank46.default)($await_15), _footerLeadingBlank30 = (0, _slicedToArray3.default)(_footerLeadingBlank29, 1);
			actual = _footerLeadingBlank30[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with blank line before footer should fail for "never"', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank31, _footerLeadingBlank32, actual, expected;

	return Promise.resolve(parsed.with).then(function ($await_16) {
		try {
			_footerLeadingBlank31 = (0, _footerLeadingBlank46.default)($await_16, 'never'), _footerLeadingBlank32 = (0, _slicedToArray3.default)(_footerLeadingBlank31, 1);
			actual = _footerLeadingBlank32[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with blank line before footer should succeed for "always"', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank33, _footerLeadingBlank34, actual, expected;

	return Promise.resolve(parsed.with).then(function ($await_17) {
		try {
			_footerLeadingBlank33 = (0, _footerLeadingBlank46.default)($await_17, 'always'), _footerLeadingBlank34 = (0, _slicedToArray3.default)(_footerLeadingBlank33, 1);
			actual = _footerLeadingBlank34[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with blank line before footer and multiline body should succeed for empty keyword', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank35, _footerLeadingBlank36, actual, expected;

	return Promise.resolve(parsed.withMulitLine).then(function ($await_18) {
		try {
			_footerLeadingBlank35 = (0, _footerLeadingBlank46.default)($await_18), _footerLeadingBlank36 = (0, _slicedToArray3.default)(_footerLeadingBlank35, 1);
			actual = _footerLeadingBlank36[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with blank line before footer and multiline body should fail for "never"', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank37, _footerLeadingBlank38, actual, expected;

	return Promise.resolve(parsed.withMulitLine).then(function ($await_19) {
		try {
			_footerLeadingBlank37 = (0, _footerLeadingBlank46.default)($await_19, 'never'), _footerLeadingBlank38 = (0, _slicedToArray3.default)(_footerLeadingBlank37, 1);
			actual = _footerLeadingBlank38[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with blank line before footer and multiline body should succeed for "always"', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank39, _footerLeadingBlank40, actual, expected;

	return Promise.resolve(parsed.withMulitLine).then(function ($await_20) {
		try {
			_footerLeadingBlank39 = (0, _footerLeadingBlank46.default)($await_20, 'always'), _footerLeadingBlank40 = (0, _slicedToArray3.default)(_footerLeadingBlank39, 1);
			actual = _footerLeadingBlank40[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with double blank line before footer and double line in body should fail for "never"', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank41, _footerLeadingBlank42, actual, expected;

	return Promise.resolve(parsed.withDoubleNewLine).then(function ($await_21) {
		try {
			_footerLeadingBlank41 = (0, _footerLeadingBlank46.default)($await_21, 'never'), _footerLeadingBlank42 = (0, _slicedToArray3.default)(_footerLeadingBlank41, 1);
			actual = _footerLeadingBlank42[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with double blank line before footer and double line in body should succeed for "always"', t => new Promise(function ($return, $error) {
	var _footerLeadingBlank43, _footerLeadingBlank44, actual, expected;

	return Promise.resolve(parsed.withDoubleNewLine).then(function ($await_22) {
		try {
			_footerLeadingBlank43 = (0, _footerLeadingBlank46.default)($await_22, 'always'), _footerLeadingBlank44 = (0, _slicedToArray3.default)(_footerLeadingBlank43, 1);
			actual = _footerLeadingBlank44[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));
//# sourceMappingURL=footer-leading-blank.test.js.map