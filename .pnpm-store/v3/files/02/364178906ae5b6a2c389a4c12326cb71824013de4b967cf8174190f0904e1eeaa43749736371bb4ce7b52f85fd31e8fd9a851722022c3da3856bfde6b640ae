'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _parse = require('@commitlint/parse');

var _parse2 = _interopRequireDefault(_parse);

var _scopeCase93 = require('./scope-case');

var _scopeCase94 = _interopRequireDefault(_scopeCase93);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const messages = {
	empty: 'test: subject',
	lowercase: 'test(scope): subject',
	mixedcase: 'test(sCoPe): subject',
	uppercase: 'test(SCOPE): subject',
	camelcase: 'test(myScope): subject',
	kebabcase: 'test(my-scope): subject',
	pascalcase: 'test(MyScope): subject',
	snakecase: 'test(my_scope): subject',
	startcase: 'test(My Scope): subject'
};

const parsed = {
	empty: (0, _parse2.default)(messages.empty),
	lowercase: (0, _parse2.default)(messages.lowercase),
	mixedcase: (0, _parse2.default)(messages.mixedcase),
	uppercase: (0, _parse2.default)(messages.uppercase),
	camelcase: (0, _parse2.default)(messages.camelcase),
	kebabcase: (0, _parse2.default)(messages.kebabcase),
	pascalcase: (0, _parse2.default)(messages.pascalcase),
	snakecase: (0, _parse2.default)(messages.snakecase),
	startcase: (0, _parse2.default)(messages.startcase)
};

(0, _ava2.default)('with empty scope should succeed for "never lowercase"', t => new Promise(function ($return, $error) {
	var _scopeCase, _scopeCase2, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_1) {
		try {
			_scopeCase = (0, _scopeCase94.default)($await_1, 'never', 'lowercase'), _scopeCase2 = (0, _slicedToArray3.default)(_scopeCase, 1);
			actual = _scopeCase2[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty scope should succeed for "always lowercase"', t => new Promise(function ($return, $error) {
	var _scopeCase3, _scopeCase4, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_2) {
		try {
			_scopeCase3 = (0, _scopeCase94.default)($await_2, 'always', 'lowercase'), _scopeCase4 = (0, _slicedToArray3.default)(_scopeCase3, 1);
			actual = _scopeCase4[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty scope should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _scopeCase5, _scopeCase6, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_3) {
		try {
			_scopeCase5 = (0, _scopeCase94.default)($await_3, 'never', 'uppercase'), _scopeCase6 = (0, _slicedToArray3.default)(_scopeCase5, 1);
			actual = _scopeCase6[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty scope should succeed for "always uppercase"', t => new Promise(function ($return, $error) {
	var _scopeCase7, _scopeCase8, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_4) {
		try {
			_scopeCase7 = (0, _scopeCase94.default)($await_4, 'always', 'uppercase'), _scopeCase8 = (0, _slicedToArray3.default)(_scopeCase7, 1);
			actual = _scopeCase8[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty scope should succeed for "never camelcase"', t => new Promise(function ($return, $error) {
	var _scopeCase9, _scopeCase10, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_5) {
		try {
			_scopeCase9 = (0, _scopeCase94.default)($await_5, 'never', 'camel-case'), _scopeCase10 = (0, _slicedToArray3.default)(_scopeCase9, 1);
			actual = _scopeCase10[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty scope should succeed for "always camelcase"', t => new Promise(function ($return, $error) {
	var _scopeCase11, _scopeCase12, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_6) {
		try {
			_scopeCase11 = (0, _scopeCase94.default)($await_6, 'never', 'camel-case'), _scopeCase12 = (0, _slicedToArray3.default)(_scopeCase11, 1);
			actual = _scopeCase12[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty scope should succeed for "never kebabcase"', t => new Promise(function ($return, $error) {
	var _scopeCase13, _scopeCase14, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_7) {
		try {
			_scopeCase13 = (0, _scopeCase94.default)($await_7, 'never', 'kebab-case'), _scopeCase14 = (0, _slicedToArray3.default)(_scopeCase13, 1);
			actual = _scopeCase14[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty scope should succeed for "always kebabcase"', t => new Promise(function ($return, $error) {
	var _scopeCase15, _scopeCase16, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_8) {
		try {
			_scopeCase15 = (0, _scopeCase94.default)($await_8, 'never', 'kebab-case'), _scopeCase16 = (0, _slicedToArray3.default)(_scopeCase15, 1);
			actual = _scopeCase16[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty scope should succeed for "never pascalcase"', t => new Promise(function ($return, $error) {
	var _scopeCase17, _scopeCase18, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_9) {
		try {
			_scopeCase17 = (0, _scopeCase94.default)($await_9, 'never', 'pascal-case'), _scopeCase18 = (0, _slicedToArray3.default)(_scopeCase17, 1);
			actual = _scopeCase18[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty scope should succeed for "always pascalcase"', t => new Promise(function ($return, $error) {
	var _scopeCase19, _scopeCase20, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_10) {
		try {
			_scopeCase19 = (0, _scopeCase94.default)($await_10, 'never', 'pascal-case'), _scopeCase20 = (0, _slicedToArray3.default)(_scopeCase19, 1);
			actual = _scopeCase20[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty scope should succeed for "never snakecase"', t => new Promise(function ($return, $error) {
	var _scopeCase21, _scopeCase22, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_11) {
		try {
			_scopeCase21 = (0, _scopeCase94.default)($await_11, 'never', 'snake-case'), _scopeCase22 = (0, _slicedToArray3.default)(_scopeCase21, 1);
			actual = _scopeCase22[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty scope should succeed for "always snakecase"', t => new Promise(function ($return, $error) {
	var _scopeCase23, _scopeCase24, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_12) {
		try {
			_scopeCase23 = (0, _scopeCase94.default)($await_12, 'never', 'snake-case'), _scopeCase24 = (0, _slicedToArray3.default)(_scopeCase23, 1);
			actual = _scopeCase24[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty scope should succeed for "never startcase"', t => new Promise(function ($return, $error) {
	var _scopeCase25, _scopeCase26, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_13) {
		try {
			_scopeCase25 = (0, _scopeCase94.default)($await_13, 'never', 'start-case'), _scopeCase26 = (0, _slicedToArray3.default)(_scopeCase25, 1);
			actual = _scopeCase26[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty scope should succeed for "always startcase"', t => new Promise(function ($return, $error) {
	var _scopeCase27, _scopeCase28, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_14) {
		try {
			_scopeCase27 = (0, _scopeCase94.default)($await_14, 'never', 'start-case'), _scopeCase28 = (0, _slicedToArray3.default)(_scopeCase27, 1);
			actual = _scopeCase28[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with lowercase scope should fail for "never lowercase"', t => new Promise(function ($return, $error) {
	var _scopeCase29, _scopeCase30, actual, expected;

	return Promise.resolve(parsed.lowercase).then(function ($await_15) {
		try {
			_scopeCase29 = (0, _scopeCase94.default)($await_15, 'never', 'lowercase'), _scopeCase30 = (0, _slicedToArray3.default)(_scopeCase29, 1);
			actual = _scopeCase30[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with lowercase scope should succeed for "always lowercase"', t => new Promise(function ($return, $error) {
	var _scopeCase31, _scopeCase32, actual, expected;

	return Promise.resolve(parsed.lowercase).then(function ($await_16) {
		try {
			_scopeCase31 = (0, _scopeCase94.default)($await_16, 'always', 'lowercase'), _scopeCase32 = (0, _slicedToArray3.default)(_scopeCase31, 1);
			actual = _scopeCase32[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase scope should succeed for "never lowercase"', t => new Promise(function ($return, $error) {
	var _scopeCase33, _scopeCase34, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_17) {
		try {
			_scopeCase33 = (0, _scopeCase94.default)($await_17, 'never', 'lowercase'), _scopeCase34 = (0, _slicedToArray3.default)(_scopeCase33, 1);
			actual = _scopeCase34[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase scope should fail for "always lowercase"', t => new Promise(function ($return, $error) {
	var _scopeCase35, _scopeCase36, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_18) {
		try {
			_scopeCase35 = (0, _scopeCase94.default)($await_18, 'always', 'lowercase'), _scopeCase36 = (0, _slicedToArray3.default)(_scopeCase35, 1);
			actual = _scopeCase36[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase scope should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _scopeCase37, _scopeCase38, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_19) {
		try {
			_scopeCase37 = (0, _scopeCase94.default)($await_19, 'never', 'uppercase'), _scopeCase38 = (0, _slicedToArray3.default)(_scopeCase37, 1);
			actual = _scopeCase38[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with kebabcase scope should succeed for "always lowercase"', t => new Promise(function ($return, $error) {
	var _scopeCase39, _scopeCase40, actual, expected;

	return Promise.resolve(parsed.kebabcase).then(function ($await_20) {
		try {
			_scopeCase39 = (0, _scopeCase94.default)($await_20, 'always', 'lowercase'), _scopeCase40 = (0, _slicedToArray3.default)(_scopeCase39, 1);
			actual = _scopeCase40[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with kebabcase scope should fail for "always camelcase"', t => new Promise(function ($return, $error) {
	var _scopeCase41, _scopeCase42, actual, expected;

	return Promise.resolve(parsed.kebabcase).then(function ($await_21) {
		try {
			_scopeCase41 = (0, _scopeCase94.default)($await_21, 'always', 'camel-case'), _scopeCase42 = (0, _slicedToArray3.default)(_scopeCase41, 1);
			actual = _scopeCase42[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with kebabcase scope should fail for "always pascalcase"', t => new Promise(function ($return, $error) {
	var _scopeCase43, _scopeCase44, actual, expected;

	return Promise.resolve(parsed.kebabcase).then(function ($await_22) {
		try {
			_scopeCase43 = (0, _scopeCase94.default)($await_22, 'always', 'pascal-case'), _scopeCase44 = (0, _slicedToArray3.default)(_scopeCase43, 1);
			actual = _scopeCase44[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with kebabcase scope should succeed for "always kebabcase"', t => new Promise(function ($return, $error) {
	var _scopeCase45, _scopeCase46, actual, expected;

	return Promise.resolve(parsed.kebabcase).then(function ($await_23) {
		try {
			_scopeCase45 = (0, _scopeCase94.default)($await_23, 'always', 'kebab-case'), _scopeCase46 = (0, _slicedToArray3.default)(_scopeCase45, 1);
			actual = _scopeCase46[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase scope should succeed for "always lowercase"', t => new Promise(function ($return, $error) {
	var _scopeCase47, _scopeCase48, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_24) {
		try {
			_scopeCase47 = (0, _scopeCase94.default)($await_24, 'always', 'lowercase'), _scopeCase48 = (0, _slicedToArray3.default)(_scopeCase47, 1);
			actual = _scopeCase48[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase scope should fail for "always camelcase"', t => new Promise(function ($return, $error) {
	var _scopeCase49, _scopeCase50, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_25) {
		try {
			_scopeCase49 = (0, _scopeCase94.default)($await_25, 'always', 'camel-case'), _scopeCase50 = (0, _slicedToArray3.default)(_scopeCase49, 1);
			actual = _scopeCase50[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase scope should fail for "always pascalcase"', t => new Promise(function ($return, $error) {
	var _scopeCase51, _scopeCase52, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_26) {
		try {
			_scopeCase51 = (0, _scopeCase94.default)($await_26, 'always', 'pascal-case'), _scopeCase52 = (0, _slicedToArray3.default)(_scopeCase51, 1);
			actual = _scopeCase52[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase scope should succeed for "always snakecase"', t => new Promise(function ($return, $error) {
	var _scopeCase53, _scopeCase54, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_27) {
		try {
			_scopeCase53 = (0, _scopeCase94.default)($await_27, 'always', 'snake-case'), _scopeCase54 = (0, _slicedToArray3.default)(_scopeCase53, 1);
			actual = _scopeCase54[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase scope should fail for "always lowercase"', t => new Promise(function ($return, $error) {
	var _scopeCase55, _scopeCase56, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_28) {
		try {
			_scopeCase55 = (0, _scopeCase94.default)($await_28, 'always', 'lowercase'), _scopeCase56 = (0, _slicedToArray3.default)(_scopeCase55, 1);
			actual = _scopeCase56[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase scope should succeed for "always camelcase"', t => new Promise(function ($return, $error) {
	var _scopeCase57, _scopeCase58, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_29) {
		try {
			_scopeCase57 = (0, _scopeCase94.default)($await_29, 'always', 'camel-case'), _scopeCase58 = (0, _slicedToArray3.default)(_scopeCase57, 1);
			actual = _scopeCase58[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase scope should fail for "always kebabcase"', t => new Promise(function ($return, $error) {
	var _scopeCase59, _scopeCase60, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_30) {
		try {
			_scopeCase59 = (0, _scopeCase94.default)($await_30, 'always', 'kebab-case'), _scopeCase60 = (0, _slicedToArray3.default)(_scopeCase59, 1);
			actual = _scopeCase60[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase scope should fail for "always pascalcase"', t => new Promise(function ($return, $error) {
	var _scopeCase61, _scopeCase62, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_31) {
		try {
			_scopeCase61 = (0, _scopeCase94.default)($await_31, 'always', 'pascal-case'), _scopeCase62 = (0, _slicedToArray3.default)(_scopeCase61, 1);
			actual = _scopeCase62[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase scope should fail for "always lowercase"', t => new Promise(function ($return, $error) {
	var _scopeCase63, _scopeCase64, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_32) {
		try {
			_scopeCase63 = (0, _scopeCase94.default)($await_32, 'always', 'lowercase'), _scopeCase64 = (0, _slicedToArray3.default)(_scopeCase63, 1);
			actual = _scopeCase64[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase scope should fail for "always kebabcase"', t => new Promise(function ($return, $error) {
	var _scopeCase65, _scopeCase66, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_33) {
		try {
			_scopeCase65 = (0, _scopeCase94.default)($await_33, 'always', 'kebab-case'), _scopeCase66 = (0, _slicedToArray3.default)(_scopeCase65, 1);
			actual = _scopeCase66[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase scope should fail for "always camelcase"', t => new Promise(function ($return, $error) {
	var _scopeCase67, _scopeCase68, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_34) {
		try {
			_scopeCase67 = (0, _scopeCase94.default)($await_34, 'always', 'camel-case'), _scopeCase68 = (0, _slicedToArray3.default)(_scopeCase67, 1);
			actual = _scopeCase68[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase scope should succeed for "always pascalcase"', t => new Promise(function ($return, $error) {
	var _scopeCase69, _scopeCase70, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_35) {
		try {
			_scopeCase69 = (0, _scopeCase94.default)($await_35, 'always', 'pascal-case'), _scopeCase70 = (0, _slicedToArray3.default)(_scopeCase69, 1);
			actual = _scopeCase70[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase scope should fail for "always uppercase"', t => new Promise(function ($return, $error) {
	var _scopeCase71, _scopeCase72, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_36) {
		try {
			_scopeCase71 = (0, _scopeCase94.default)($await_36, 'always', 'uppercase'), _scopeCase72 = (0, _slicedToArray3.default)(_scopeCase71, 1);
			actual = _scopeCase72[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with uppercase scope should fail for "never uppercase"', t => new Promise(function ($return, $error) {
	var _scopeCase73, _scopeCase74, actual, expected;

	return Promise.resolve(parsed.uppercase).then(function ($await_37) {
		try {
			_scopeCase73 = (0, _scopeCase94.default)($await_37, 'never', 'uppercase'), _scopeCase74 = (0, _slicedToArray3.default)(_scopeCase73, 1);
			actual = _scopeCase74[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with uppercase scope should succeed for "always uppercase"', t => new Promise(function ($return, $error) {
	var _scopeCase75, _scopeCase76, actual, expected;

	return Promise.resolve(parsed.uppercase).then(function ($await_38) {
		try {
			_scopeCase75 = (0, _scopeCase94.default)($await_38, 'always', 'uppercase'), _scopeCase76 = (0, _slicedToArray3.default)(_scopeCase75, 1);
			actual = _scopeCase76[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with uppercase scope should succeed for "always [uppercase, lowercase]"', t => new Promise(function ($return, $error) {
	var _scopeCase77, _scopeCase78, actual, expected;

	return Promise.resolve(parsed.uppercase).then(function ($await_39) {
		try {
			_scopeCase77 = (0, _scopeCase94.default)($await_39, 'always', ['uppercase', 'lowercase']), _scopeCase78 = (0, _slicedToArray3.default)(_scopeCase77, 1);
			actual = _scopeCase78[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with lowercase scope should succeed for "always [uppercase, lowercase]"', t => new Promise(function ($return, $error) {
	var _scopeCase79, _scopeCase80, actual, expected;

	return Promise.resolve(parsed.lowercase).then(function ($await_40) {
		try {
			_scopeCase79 = (0, _scopeCase94.default)($await_40, 'always', ['uppercase', 'lowercase']), _scopeCase80 = (0, _slicedToArray3.default)(_scopeCase79, 1);
			actual = _scopeCase80[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase scope should fail for "always [uppercase, lowercase]"', t => new Promise(function ($return, $error) {
	var _scopeCase81, _scopeCase82, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_41) {
		try {
			_scopeCase81 = (0, _scopeCase94.default)($await_41, 'always', ['uppercase', 'lowercase']), _scopeCase82 = (0, _slicedToArray3.default)(_scopeCase81, 1);
			actual = _scopeCase82[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase scope should pass for "always [uppercase, lowercase, camel-case]"', t => new Promise(function ($return, $error) {
	var _scopeCase83, _scopeCase84, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_42) {
		try {
			_scopeCase83 = (0, _scopeCase94.default)($await_42, 'always', ['uppercase', 'lowercase', 'camel-case']), _scopeCase84 = (0, _slicedToArray3.default)(_scopeCase83, 1);
			actual = _scopeCase84[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase scope should pass for "never [uppercase, lowercase]"', t => new Promise(function ($return, $error) {
	var _scopeCase85, _scopeCase86, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_43) {
		try {
			_scopeCase85 = (0, _scopeCase94.default)($await_43, 'never', ['uppercase', 'lowercase']), _scopeCase86 = (0, _slicedToArray3.default)(_scopeCase85, 1);
			actual = _scopeCase86[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with uppercase scope should fail for "never [uppercase, lowercase]"', t => new Promise(function ($return, $error) {
	var _scopeCase87, _scopeCase88, actual, expected;

	return Promise.resolve(parsed.uppercase).then(function ($await_44) {
		try {
			_scopeCase87 = (0, _scopeCase94.default)($await_44, 'never', ['uppercase', 'lowercase']), _scopeCase88 = (0, _slicedToArray3.default)(_scopeCase87, 1);
			actual = _scopeCase88[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with slash in scope should succeed for "always pascal-case"', t => new Promise(function ($return, $error) {
	var commit, _scopeCase89, _scopeCase90, actual, expected;

	return Promise.resolve((0, _parse2.default)('feat(Modules/Graph): add Pie Chart')).then(function ($await_45) {
		try {
			commit = $await_45;
			_scopeCase89 = (0, _scopeCase94.default)(commit, 'always', 'pascal-case'), _scopeCase90 = (0, _slicedToArray3.default)(_scopeCase89, 1);
			actual = _scopeCase90[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with slash in subject should succeed for "always sentence case"', t => new Promise(function ($return, $error) {
	var commit, _scopeCase91, _scopeCase92, actual, expected;

	return Promise.resolve((0, _parse2.default)('chore: Update @angular/core')).then(function ($await_46) {
		try {
			commit = $await_46;
			_scopeCase91 = (0, _scopeCase94.default)(commit, 'always', 'sentencecase'), _scopeCase92 = (0, _slicedToArray3.default)(_scopeCase91, 1);
			actual = _scopeCase92[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));
//# sourceMappingURL=scope-case.test.js.map