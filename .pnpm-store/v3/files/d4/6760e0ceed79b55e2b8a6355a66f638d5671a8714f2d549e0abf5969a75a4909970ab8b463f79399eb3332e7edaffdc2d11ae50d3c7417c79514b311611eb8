'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _parse = require('@commitlint/parse');

var _parse2 = _interopRequireDefault(_parse);

var _subjectCase99 = require('./subject-case');

var _subjectCase100 = _interopRequireDefault(_subjectCase99);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const messages = {
	empty: 'test:\n',
	numeric: 'test: 1.0.0',
	lowercase: 'test: subject',
	mixedcase: 'test: sUbJeCt',
	uppercase: 'test: SUBJECT',
	camelcase: 'test: subJect',
	kebabcase: 'test: sub-ject',
	pascalcase: 'test: SubJect',
	snakecase: 'test: sub_ject',
	startcase: 'test: Sub Ject'
};

const parsed = {
	empty: (0, _parse2.default)(messages.empty),
	numeric: (0, _parse2.default)(messages.numeric),
	lowercase: (0, _parse2.default)(messages.lowercase),
	mixedcase: (0, _parse2.default)(messages.mixedcase),
	uppercase: (0, _parse2.default)(messages.uppercase),
	camelcase: (0, _parse2.default)(messages.camelcase),
	kebabcase: (0, _parse2.default)(messages.kebabcase),
	pascalcase: (0, _parse2.default)(messages.pascalcase),
	snakecase: (0, _parse2.default)(messages.snakecase),
	startcase: (0, _parse2.default)(messages.startcase)
};

(0, _ava2.default)('with empty subject should succeed for "never lowercase"', t => new Promise(function ($return, $error) {
	var _subjectCase, _subjectCase2, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_1) {
		try {
			_subjectCase = (0, _subjectCase100.default)($await_1, 'never', 'lowercase'), _subjectCase2 = (0, _slicedToArray3.default)(_subjectCase, 1);
			actual = _subjectCase2[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty subject should succeed for "always lowercase"', t => new Promise(function ($return, $error) {
	var _subjectCase3, _subjectCase4, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_2) {
		try {
			_subjectCase3 = (0, _subjectCase100.default)($await_2, 'always', 'lowercase'), _subjectCase4 = (0, _slicedToArray3.default)(_subjectCase3, 1);
			actual = _subjectCase4[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty subject should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _subjectCase5, _subjectCase6, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_3) {
		try {
			_subjectCase5 = (0, _subjectCase100.default)($await_3, 'never', 'uppercase'), _subjectCase6 = (0, _slicedToArray3.default)(_subjectCase5, 1);
			actual = _subjectCase6[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty subject should succeed for "always uppercase"', t => new Promise(function ($return, $error) {
	var _subjectCase7, _subjectCase8, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_4) {
		try {
			_subjectCase7 = (0, _subjectCase100.default)($await_4, 'always', 'uppercase'), _subjectCase8 = (0, _slicedToArray3.default)(_subjectCase7, 1);
			actual = _subjectCase8[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with lowercase subject should fail for "never lowercase"', t => new Promise(function ($return, $error) {
	var _subjectCase9, _subjectCase10, actual, expected;

	return Promise.resolve(parsed.lowercase).then(function ($await_5) {
		try {
			_subjectCase9 = (0, _subjectCase100.default)($await_5, 'never', 'lowercase'), _subjectCase10 = (0, _slicedToArray3.default)(_subjectCase9, 1);
			actual = _subjectCase10[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with lowercase subject should succeed for "always lowercase"', t => new Promise(function ($return, $error) {
	var _subjectCase11, _subjectCase12, actual, expected;

	return Promise.resolve(parsed.lowercase).then(function ($await_6) {
		try {
			_subjectCase11 = (0, _subjectCase100.default)($await_6, 'always', 'lowercase'), _subjectCase12 = (0, _slicedToArray3.default)(_subjectCase11, 1);
			actual = _subjectCase12[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase subject should succeed for "never lowercase"', t => new Promise(function ($return, $error) {
	var _subjectCase13, _subjectCase14, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_7) {
		try {
			_subjectCase13 = (0, _subjectCase100.default)($await_7, 'never', 'lowercase'), _subjectCase14 = (0, _slicedToArray3.default)(_subjectCase13, 1);
			actual = _subjectCase14[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase subject should fail for "always lowercase"', t => new Promise(function ($return, $error) {
	var _subjectCase15, _subjectCase16, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_8) {
		try {
			_subjectCase15 = (0, _subjectCase100.default)($await_8, 'always', 'lowercase'), _subjectCase16 = (0, _slicedToArray3.default)(_subjectCase15, 1);
			actual = _subjectCase16[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase subject should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _subjectCase17, _subjectCase18, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_9) {
		try {
			_subjectCase17 = (0, _subjectCase100.default)($await_9, 'never', 'uppercase'), _subjectCase18 = (0, _slicedToArray3.default)(_subjectCase17, 1);
			actual = _subjectCase18[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase subject should fail for "always uppercase"', t => new Promise(function ($return, $error) {
	var _subjectCase19, _subjectCase20, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_10) {
		try {
			_subjectCase19 = (0, _subjectCase100.default)($await_10, 'always', 'uppercase'), _subjectCase20 = (0, _slicedToArray3.default)(_subjectCase19, 1);
			actual = _subjectCase20[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with uppercase subject should fail for "never uppercase"', t => new Promise(function ($return, $error) {
	var _subjectCase21, _subjectCase22, actual, expected;

	return Promise.resolve(parsed.uppercase).then(function ($await_11) {
		try {
			_subjectCase21 = (0, _subjectCase100.default)($await_11, 'never', 'uppercase'), _subjectCase22 = (0, _slicedToArray3.default)(_subjectCase21, 1);
			actual = _subjectCase22[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with lowercase subject should succeed for "always uppercase"', t => new Promise(function ($return, $error) {
	var _subjectCase23, _subjectCase24, actual, expected;

	return Promise.resolve(parsed.uppercase).then(function ($await_12) {
		try {
			_subjectCase23 = (0, _subjectCase100.default)($await_12, 'always', 'uppercase'), _subjectCase24 = (0, _slicedToArray3.default)(_subjectCase23, 1);
			actual = _subjectCase24[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase subject should fail for "always uppercase"', t => new Promise(function ($return, $error) {
	var _subjectCase25, _subjectCase26, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_13) {
		try {
			_subjectCase25 = (0, _subjectCase100.default)($await_13, 'always', 'uppercase'), _subjectCase26 = (0, _slicedToArray3.default)(_subjectCase25, 1);
			actual = _subjectCase26[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase subject should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _subjectCase27, _subjectCase28, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_14) {
		try {
			_subjectCase27 = (0, _subjectCase100.default)($await_14, 'never', 'uppercase'), _subjectCase28 = (0, _slicedToArray3.default)(_subjectCase27, 1);
			actual = _subjectCase28[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase subject should fail for "always pascalcase"', t => new Promise(function ($return, $error) {
	var _subjectCase29, _subjectCase30, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_15) {
		try {
			_subjectCase29 = (0, _subjectCase100.default)($await_15, 'always', 'pascal-case'), _subjectCase30 = (0, _slicedToArray3.default)(_subjectCase29, 1);
			actual = _subjectCase30[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase subject should fail for "always kebabcase"', t => new Promise(function ($return, $error) {
	var _subjectCase31, _subjectCase32, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_16) {
		try {
			_subjectCase31 = (0, _subjectCase100.default)($await_16, 'always', 'kebab-case'), _subjectCase32 = (0, _slicedToArray3.default)(_subjectCase31, 1);
			actual = _subjectCase32[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase subject should fail for "always snakecase"', t => new Promise(function ($return, $error) {
	var _subjectCase33, _subjectCase34, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_17) {
		try {
			_subjectCase33 = (0, _subjectCase100.default)($await_17, 'always', 'snake-case'), _subjectCase34 = (0, _slicedToArray3.default)(_subjectCase33, 1);
			actual = _subjectCase34[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase subject should succeed for "always camelcase"', t => new Promise(function ($return, $error) {
	var _subjectCase35, _subjectCase36, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_18) {
		try {
			_subjectCase35 = (0, _subjectCase100.default)($await_18, 'always', 'camel-case'), _subjectCase36 = (0, _slicedToArray3.default)(_subjectCase35, 1);
			actual = _subjectCase36[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase subject should fail for "always uppercase"', t => new Promise(function ($return, $error) {
	var _subjectCase37, _subjectCase38, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_19) {
		try {
			_subjectCase37 = (0, _subjectCase100.default)($await_19, 'always', 'uppercase'), _subjectCase38 = (0, _slicedToArray3.default)(_subjectCase37, 1);
			actual = _subjectCase38[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase subject should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _subjectCase39, _subjectCase40, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_20) {
		try {
			_subjectCase39 = (0, _subjectCase100.default)($await_20, 'never', 'uppercase'), _subjectCase40 = (0, _slicedToArray3.default)(_subjectCase39, 1);
			actual = _subjectCase40[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase subject should succeed for "always pascalcase"', t => new Promise(function ($return, $error) {
	var _subjectCase41, _subjectCase42, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_21) {
		try {
			_subjectCase41 = (0, _subjectCase100.default)($await_21, 'always', 'pascal-case'), _subjectCase42 = (0, _slicedToArray3.default)(_subjectCase41, 1);
			actual = _subjectCase42[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase subject should fail for "always kebabcase"', t => new Promise(function ($return, $error) {
	var _subjectCase43, _subjectCase44, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_22) {
		try {
			_subjectCase43 = (0, _subjectCase100.default)($await_22, 'always', 'kebab-case'), _subjectCase44 = (0, _slicedToArray3.default)(_subjectCase43, 1);
			actual = _subjectCase44[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase subject should fail for "always snakecase"', t => new Promise(function ($return, $error) {
	var _subjectCase45, _subjectCase46, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_23) {
		try {
			_subjectCase45 = (0, _subjectCase100.default)($await_23, 'always', 'snake-case'), _subjectCase46 = (0, _slicedToArray3.default)(_subjectCase45, 1);
			actual = _subjectCase46[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase subject should fail for "always camelcase"', t => new Promise(function ($return, $error) {
	var _subjectCase47, _subjectCase48, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_24) {
		try {
			_subjectCase47 = (0, _subjectCase100.default)($await_24, 'always', 'camel-case'), _subjectCase48 = (0, _slicedToArray3.default)(_subjectCase47, 1);
			actual = _subjectCase48[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase subject should fail for "always uppercase"', t => new Promise(function ($return, $error) {
	var _subjectCase49, _subjectCase50, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_25) {
		try {
			_subjectCase49 = (0, _subjectCase100.default)($await_25, 'always', 'uppercase'), _subjectCase50 = (0, _slicedToArray3.default)(_subjectCase49, 1);
			actual = _subjectCase50[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase subject should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _subjectCase51, _subjectCase52, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_26) {
		try {
			_subjectCase51 = (0, _subjectCase100.default)($await_26, 'never', 'uppercase'), _subjectCase52 = (0, _slicedToArray3.default)(_subjectCase51, 1);
			actual = _subjectCase52[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase subject should fail for "always pascalcase"', t => new Promise(function ($return, $error) {
	var _subjectCase53, _subjectCase54, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_27) {
		try {
			_subjectCase53 = (0, _subjectCase100.default)($await_27, 'always', 'pascal-case'), _subjectCase54 = (0, _slicedToArray3.default)(_subjectCase53, 1);
			actual = _subjectCase54[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase subject should fail for "always kebabcase"', t => new Promise(function ($return, $error) {
	var _subjectCase55, _subjectCase56, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_28) {
		try {
			_subjectCase55 = (0, _subjectCase100.default)($await_28, 'always', 'kebab-case'), _subjectCase56 = (0, _slicedToArray3.default)(_subjectCase55, 1);
			actual = _subjectCase56[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase subject should succeed for "always snakecase"', t => new Promise(function ($return, $error) {
	var _subjectCase57, _subjectCase58, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_29) {
		try {
			_subjectCase57 = (0, _subjectCase100.default)($await_29, 'always', 'snake-case'), _subjectCase58 = (0, _slicedToArray3.default)(_subjectCase57, 1);
			actual = _subjectCase58[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase subject should fail for "always camelcase"', t => new Promise(function ($return, $error) {
	var _subjectCase59, _subjectCase60, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_30) {
		try {
			_subjectCase59 = (0, _subjectCase100.default)($await_30, 'always', 'camel-case'), _subjectCase60 = (0, _slicedToArray3.default)(_subjectCase59, 1);
			actual = _subjectCase60[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase subject should fail for "always uppercase"', t => new Promise(function ($return, $error) {
	var _subjectCase61, _subjectCase62, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_31) {
		try {
			_subjectCase61 = (0, _subjectCase100.default)($await_31, 'always', 'uppercase'), _subjectCase62 = (0, _slicedToArray3.default)(_subjectCase61, 1);
			actual = _subjectCase62[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase subject should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _subjectCase63, _subjectCase64, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_32) {
		try {
			_subjectCase63 = (0, _subjectCase100.default)($await_32, 'never', 'uppercase'), _subjectCase64 = (0, _slicedToArray3.default)(_subjectCase63, 1);
			actual = _subjectCase64[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase subject should fail for "always pascalcase"', t => new Promise(function ($return, $error) {
	var _subjectCase65, _subjectCase66, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_33) {
		try {
			_subjectCase65 = (0, _subjectCase100.default)($await_33, 'always', 'pascal-case'), _subjectCase66 = (0, _slicedToArray3.default)(_subjectCase65, 1);
			actual = _subjectCase66[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase subject should fail for "always kebabcase"', t => new Promise(function ($return, $error) {
	var _subjectCase67, _subjectCase68, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_34) {
		try {
			_subjectCase67 = (0, _subjectCase100.default)($await_34, 'always', 'kebab-case'), _subjectCase68 = (0, _slicedToArray3.default)(_subjectCase67, 1);
			actual = _subjectCase68[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase subject should fail for "always snakecase"', t => new Promise(function ($return, $error) {
	var _subjectCase69, _subjectCase70, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_35) {
		try {
			_subjectCase69 = (0, _subjectCase100.default)($await_35, 'always', 'snake-case'), _subjectCase70 = (0, _slicedToArray3.default)(_subjectCase69, 1);
			actual = _subjectCase70[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase subject should fail for "always camelcase"', t => new Promise(function ($return, $error) {
	var _subjectCase71, _subjectCase72, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_36) {
		try {
			_subjectCase71 = (0, _subjectCase100.default)($await_36, 'always', 'camel-case'), _subjectCase72 = (0, _slicedToArray3.default)(_subjectCase71, 1);
			actual = _subjectCase72[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase subject should succeed for "always startcase"', t => new Promise(function ($return, $error) {
	var _subjectCase73, _subjectCase74, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_37) {
		try {
			_subjectCase73 = (0, _subjectCase100.default)($await_37, 'always', 'start-case'), _subjectCase74 = (0, _slicedToArray3.default)(_subjectCase73, 1);
			actual = _subjectCase74[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('should use expected message with "always"', t => new Promise(function ($return, $error) {
	var _subjectCase75, _subjectCase76, message;

	return Promise.resolve(parsed.uppercase).then(function ($await_38) {
		try {
			_subjectCase75 = (0, _subjectCase100.default)($await_38, 'always', 'lower-case'), _subjectCase76 = (0, _slicedToArray3.default)(_subjectCase75, 2);
			message = _subjectCase76[1];

			t.true(message.indexOf('must be lower-case') > -1);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('should use expected message with "never"', t => new Promise(function ($return, $error) {
	var _subjectCase77, _subjectCase78, message;

	return Promise.resolve(parsed.uppercase).then(function ($await_39) {
		try {
			_subjectCase77 = (0, _subjectCase100.default)($await_39, 'never', 'upper-case'), _subjectCase78 = (0, _slicedToArray3.default)(_subjectCase77, 2);
			message = _subjectCase78[1];

			t.true(message.indexOf('must not be upper-case') > -1);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with uppercase scope should succeed for "always [uppercase, lowercase]"', t => new Promise(function ($return, $error) {
	var _subjectCase79, _subjectCase80, actual, expected;

	return Promise.resolve(parsed.uppercase).then(function ($await_40) {
		try {
			_subjectCase79 = (0, _subjectCase100.default)($await_40, 'always', ['uppercase', 'lowercase']), _subjectCase80 = (0, _slicedToArray3.default)(_subjectCase79, 1);
			actual = _subjectCase80[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with lowercase subject should succeed for "always [uppercase, lowercase]"', t => new Promise(function ($return, $error) {
	var _subjectCase81, _subjectCase82, actual, expected;

	return Promise.resolve(parsed.lowercase).then(function ($await_41) {
		try {
			_subjectCase81 = (0, _subjectCase100.default)($await_41, 'always', ['uppercase', 'lowercase']), _subjectCase82 = (0, _slicedToArray3.default)(_subjectCase81, 1);
			actual = _subjectCase82[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase subject should fail for "always [uppercase, lowercase]"', t => new Promise(function ($return, $error) {
	var _subjectCase83, _subjectCase84, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_42) {
		try {
			_subjectCase83 = (0, _subjectCase100.default)($await_42, 'always', ['uppercase', 'lowercase']), _subjectCase84 = (0, _slicedToArray3.default)(_subjectCase83, 1);
			actual = _subjectCase84[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase subject should pass for "always [uppercase, lowercase, camel-case]"', t => new Promise(function ($return, $error) {
	var _subjectCase85, _subjectCase86, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_43) {
		try {
			_subjectCase85 = (0, _subjectCase100.default)($await_43, 'always', ['uppercase', 'lowercase', 'camel-case']), _subjectCase86 = (0, _slicedToArray3.default)(_subjectCase85, 1);
			actual = _subjectCase86[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase scope should pass for "never [uppercase, lowercase]"', t => new Promise(function ($return, $error) {
	var _subjectCase87, _subjectCase88, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_44) {
		try {
			_subjectCase87 = (0, _subjectCase100.default)($await_44, 'never', ['uppercase', 'lowercase']), _subjectCase88 = (0, _slicedToArray3.default)(_subjectCase87, 1);
			actual = _subjectCase88[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with uppercase scope should fail for "never [uppercase, lowercase]"', t => new Promise(function ($return, $error) {
	var _subjectCase89, _subjectCase90, actual, expected;

	return Promise.resolve(parsed.uppercase).then(function ($await_45) {
		try {
			_subjectCase89 = (0, _subjectCase100.default)($await_45, 'never', ['uppercase', 'lowercase']), _subjectCase90 = (0, _slicedToArray3.default)(_subjectCase89, 1);
			actual = _subjectCase90[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with numeric subject should succeed for "never lowercase"', t => new Promise(function ($return, $error) {
	var _subjectCase91, _subjectCase92, actual, expected;

	return Promise.resolve(parsed.numeric).then(function ($await_46) {
		try {
			_subjectCase91 = (0, _subjectCase100.default)($await_46, 'never', 'lowercase'), _subjectCase92 = (0, _slicedToArray3.default)(_subjectCase91, 1);
			actual = _subjectCase92[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with numeric subject should succeed for "always lowercase"', t => new Promise(function ($return, $error) {
	var _subjectCase93, _subjectCase94, actual, expected;

	return Promise.resolve(parsed.numeric).then(function ($await_47) {
		try {
			_subjectCase93 = (0, _subjectCase100.default)($await_47, 'always', 'lowercase'), _subjectCase94 = (0, _slicedToArray3.default)(_subjectCase93, 1);
			actual = _subjectCase94[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with numeric subject should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _subjectCase95, _subjectCase96, actual, expected;

	return Promise.resolve(parsed.numeric).then(function ($await_48) {
		try {
			_subjectCase95 = (0, _subjectCase100.default)($await_48, 'never', 'uppercase'), _subjectCase96 = (0, _slicedToArray3.default)(_subjectCase95, 1);
			actual = _subjectCase96[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with numeric subject should succeed for "always uppercase"', t => new Promise(function ($return, $error) {
	var _subjectCase97, _subjectCase98, actual, expected;

	return Promise.resolve(parsed.numeric).then(function ($await_49) {
		try {
			_subjectCase97 = (0, _subjectCase100.default)($await_49, 'always', 'uppercase'), _subjectCase98 = (0, _slicedToArray3.default)(_subjectCase97, 1);
			actual = _subjectCase98[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));
//# sourceMappingURL=subject-case.test.js.map