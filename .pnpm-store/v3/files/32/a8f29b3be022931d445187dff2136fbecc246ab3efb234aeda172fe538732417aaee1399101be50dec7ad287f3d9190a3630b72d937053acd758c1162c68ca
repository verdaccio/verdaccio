'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _parse = require('@commitlint/parse');

var _parse2 = _interopRequireDefault(_parse);

var _typeCase93 = require('./type-case');

var _typeCase94 = _interopRequireDefault(_typeCase93);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const messages = {
	empty: '(scope): subject',
	lowercase: 'type: subject',
	mixedcase: 'tYpE: subject',
	uppercase: 'TYPE: subject',
	camelcase: 'tyPe: subject',
	pascalcase: 'TyPe: subject',
	snakecase: 'ty_pe: subject',
	kebabcase: 'ty-pe: subject',
	startcase: 'Ty Pe: subject'
};

const parsed = {
	empty: (0, _parse2.default)(messages.empty),
	lowercase: (0, _parse2.default)(messages.lowercase),
	mixedcase: (0, _parse2.default)(messages.mixedcase),
	uppercase: (0, _parse2.default)(messages.uppercase),
	camelcase: (0, _parse2.default)(messages.camelcase),
	pascalcase: (0, _parse2.default)(messages.pascalcase),
	snakecase: (0, _parse2.default)(messages.snakecase),
	kebabcase: (0, _parse2.default)(messages.kebabcase),
	startcase: (0, _parse2.default)(messages.startcase, undefined, {
		headerPattern: /^(.*): (.*)$/,
		headerCorrespondence: ['type', 'subject']
	})
};

(0, _ava2.default)('with empty type should succeed for "never lowercase"', t => new Promise(function ($return, $error) {
	var _typeCase, _typeCase2, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_1) {
		try {
			_typeCase = (0, _typeCase94.default)($await_1, 'never', 'lowercase'), _typeCase2 = (0, _slicedToArray3.default)(_typeCase, 1);
			actual = _typeCase2[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty type should succeed for "always lowercase"', t => new Promise(function ($return, $error) {
	var _typeCase3, _typeCase4, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_2) {
		try {
			_typeCase3 = (0, _typeCase94.default)($await_2, 'always', 'lowercase'), _typeCase4 = (0, _slicedToArray3.default)(_typeCase3, 1);
			actual = _typeCase4[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty type should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _typeCase5, _typeCase6, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_3) {
		try {
			_typeCase5 = (0, _typeCase94.default)($await_3, 'never', 'uppercase'), _typeCase6 = (0, _slicedToArray3.default)(_typeCase5, 1);
			actual = _typeCase6[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with empty type should succeed for "always uppercase"', t => new Promise(function ($return, $error) {
	var _typeCase7, _typeCase8, actual, expected;

	return Promise.resolve(parsed.empty).then(function ($await_4) {
		try {
			_typeCase7 = (0, _typeCase94.default)($await_4, 'always', 'uppercase'), _typeCase8 = (0, _slicedToArray3.default)(_typeCase7, 1);
			actual = _typeCase8[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with lowercase type should fail for "never lowercase"', t => new Promise(function ($return, $error) {
	var _typeCase9, _typeCase10, actual, expected;

	return Promise.resolve(parsed.lowercase).then(function ($await_5) {
		try {
			_typeCase9 = (0, _typeCase94.default)($await_5, 'never', 'lowercase'), _typeCase10 = (0, _slicedToArray3.default)(_typeCase9, 1);
			actual = _typeCase10[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with lowercase type should succeed for "always lowercase"', t => new Promise(function ($return, $error) {
	var _typeCase11, _typeCase12, actual, expected;

	return Promise.resolve(parsed.lowercase).then(function ($await_6) {
		try {
			_typeCase11 = (0, _typeCase94.default)($await_6, 'always', 'lowercase'), _typeCase12 = (0, _slicedToArray3.default)(_typeCase11, 1);
			actual = _typeCase12[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase type should succeed for "never lowercase"', t => new Promise(function ($return, $error) {
	var _typeCase13, _typeCase14, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_7) {
		try {
			_typeCase13 = (0, _typeCase94.default)($await_7, 'never', 'lowercase'), _typeCase14 = (0, _slicedToArray3.default)(_typeCase13, 1);
			actual = _typeCase14[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase type should fail for "always lowercase"', t => new Promise(function ($return, $error) {
	var _typeCase15, _typeCase16, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_8) {
		try {
			_typeCase15 = (0, _typeCase94.default)($await_8, 'always', 'lowercase'), _typeCase16 = (0, _slicedToArray3.default)(_typeCase15, 1);
			actual = _typeCase16[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase type should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _typeCase17, _typeCase18, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_9) {
		try {
			_typeCase17 = (0, _typeCase94.default)($await_9, 'never', 'uppercase'), _typeCase18 = (0, _slicedToArray3.default)(_typeCase17, 1);
			actual = _typeCase18[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase type should fail for "always uppercase"', t => new Promise(function ($return, $error) {
	var _typeCase19, _typeCase20, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_10) {
		try {
			_typeCase19 = (0, _typeCase94.default)($await_10, 'always', 'uppercase'), _typeCase20 = (0, _slicedToArray3.default)(_typeCase19, 1);
			actual = _typeCase20[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with uppercase type should fail for "never uppercase"', t => new Promise(function ($return, $error) {
	var _typeCase21, _typeCase22, actual, expected;

	return Promise.resolve(parsed.uppercase).then(function ($await_11) {
		try {
			_typeCase21 = (0, _typeCase94.default)($await_11, 'never', 'uppercase'), _typeCase22 = (0, _slicedToArray3.default)(_typeCase21, 1);
			actual = _typeCase22[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with lowercase type should succeed for "always uppercase"', t => new Promise(function ($return, $error) {
	var _typeCase23, _typeCase24, actual, expected;

	return Promise.resolve(parsed.uppercase).then(function ($await_12) {
		try {
			_typeCase23 = (0, _typeCase94.default)($await_12, 'always', 'uppercase'), _typeCase24 = (0, _slicedToArray3.default)(_typeCase23, 1);
			actual = _typeCase24[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase type should fail for "always uppercase"', t => new Promise(function ($return, $error) {
	var _typeCase25, _typeCase26, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_13) {
		try {
			_typeCase25 = (0, _typeCase94.default)($await_13, 'always', 'uppercase'), _typeCase26 = (0, _slicedToArray3.default)(_typeCase25, 1);
			actual = _typeCase26[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase type should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _typeCase27, _typeCase28, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_14) {
		try {
			_typeCase27 = (0, _typeCase94.default)($await_14, 'never', 'uppercase'), _typeCase28 = (0, _slicedToArray3.default)(_typeCase27, 1);
			actual = _typeCase28[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase type should fail for "always pascalcase"', t => new Promise(function ($return, $error) {
	var _typeCase29, _typeCase30, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_15) {
		try {
			_typeCase29 = (0, _typeCase94.default)($await_15, 'always', 'pascal-case'), _typeCase30 = (0, _slicedToArray3.default)(_typeCase29, 1);
			actual = _typeCase30[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase type should fail for "always kebabcase"', t => new Promise(function ($return, $error) {
	var _typeCase31, _typeCase32, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_16) {
		try {
			_typeCase31 = (0, _typeCase94.default)($await_16, 'always', 'kebab-case'), _typeCase32 = (0, _slicedToArray3.default)(_typeCase31, 1);
			actual = _typeCase32[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase type should fail for "always snakecase"', t => new Promise(function ($return, $error) {
	var _typeCase33, _typeCase34, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_17) {
		try {
			_typeCase33 = (0, _typeCase94.default)($await_17, 'always', 'snake-case'), _typeCase34 = (0, _slicedToArray3.default)(_typeCase33, 1);
			actual = _typeCase34[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase type should fail for "always startcase"', t => new Promise(function ($return, $error) {
	var _typeCase35, _typeCase36, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_18) {
		try {
			_typeCase35 = (0, _typeCase94.default)($await_18, 'always', 'start-case'), _typeCase36 = (0, _slicedToArray3.default)(_typeCase35, 1);
			actual = _typeCase36[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase type should succeed for "always camelcase"', t => new Promise(function ($return, $error) {
	var _typeCase37, _typeCase38, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_19) {
		try {
			_typeCase37 = (0, _typeCase94.default)($await_19, 'always', 'camel-case'), _typeCase38 = (0, _slicedToArray3.default)(_typeCase37, 1);
			actual = _typeCase38[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase type should fail for "always uppercase"', t => new Promise(function ($return, $error) {
	var _typeCase39, _typeCase40, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_20) {
		try {
			_typeCase39 = (0, _typeCase94.default)($await_20, 'always', 'uppercase'), _typeCase40 = (0, _slicedToArray3.default)(_typeCase39, 1);
			actual = _typeCase40[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase type should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _typeCase41, _typeCase42, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_21) {
		try {
			_typeCase41 = (0, _typeCase94.default)($await_21, 'never', 'uppercase'), _typeCase42 = (0, _slicedToArray3.default)(_typeCase41, 1);
			actual = _typeCase42[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase type should fail for "always camelcase"', t => new Promise(function ($return, $error) {
	var _typeCase43, _typeCase44, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_22) {
		try {
			_typeCase43 = (0, _typeCase94.default)($await_22, 'always', 'camel-case'), _typeCase44 = (0, _slicedToArray3.default)(_typeCase43, 1);
			actual = _typeCase44[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase type should fail for "always kebabcase"', t => new Promise(function ($return, $error) {
	var _typeCase45, _typeCase46, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_23) {
		try {
			_typeCase45 = (0, _typeCase94.default)($await_23, 'always', 'kebab-case'), _typeCase46 = (0, _slicedToArray3.default)(_typeCase45, 1);
			actual = _typeCase46[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase type should fail for "always snakecase"', t => new Promise(function ($return, $error) {
	var _typeCase47, _typeCase48, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_24) {
		try {
			_typeCase47 = (0, _typeCase94.default)($await_24, 'always', 'snake-case'), _typeCase48 = (0, _slicedToArray3.default)(_typeCase47, 1);
			actual = _typeCase48[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase type should fail for "always startcase"', t => new Promise(function ($return, $error) {
	var _typeCase49, _typeCase50, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_25) {
		try {
			_typeCase49 = (0, _typeCase94.default)($await_25, 'always', 'start-case'), _typeCase50 = (0, _slicedToArray3.default)(_typeCase49, 1);
			actual = _typeCase50[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase type should succeed for "always pascalcase"', t => new Promise(function ($return, $error) {
	var _typeCase51, _typeCase52, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_26) {
		try {
			_typeCase51 = (0, _typeCase94.default)($await_26, 'always', 'pascal-case'), _typeCase52 = (0, _slicedToArray3.default)(_typeCase51, 1);
			actual = _typeCase52[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase type should fail for "always uppercase"', t => new Promise(function ($return, $error) {
	var _typeCase53, _typeCase54, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_27) {
		try {
			_typeCase53 = (0, _typeCase94.default)($await_27, 'always', 'uppercase'), _typeCase54 = (0, _slicedToArray3.default)(_typeCase53, 1);
			actual = _typeCase54[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase type should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _typeCase55, _typeCase56, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_28) {
		try {
			_typeCase55 = (0, _typeCase94.default)($await_28, 'never', 'uppercase'), _typeCase56 = (0, _slicedToArray3.default)(_typeCase55, 1);
			actual = _typeCase56[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase type should fail for "always camelcase"', t => new Promise(function ($return, $error) {
	var _typeCase57, _typeCase58, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_29) {
		try {
			_typeCase57 = (0, _typeCase94.default)($await_29, 'always', 'camel-case'), _typeCase58 = (0, _slicedToArray3.default)(_typeCase57, 1);
			actual = _typeCase58[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase type should fail for "always kebabcase"', t => new Promise(function ($return, $error) {
	var _typeCase59, _typeCase60, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_30) {
		try {
			_typeCase59 = (0, _typeCase94.default)($await_30, 'always', 'kebab-case'), _typeCase60 = (0, _slicedToArray3.default)(_typeCase59, 1);
			actual = _typeCase60[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase type should succeed for "always snakecase"', t => new Promise(function ($return, $error) {
	var _typeCase61, _typeCase62, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_31) {
		try {
			_typeCase61 = (0, _typeCase94.default)($await_31, 'always', 'snake-case'), _typeCase62 = (0, _slicedToArray3.default)(_typeCase61, 1);
			actual = _typeCase62[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase type should fail for "always pascalcase"', t => new Promise(function ($return, $error) {
	var _typeCase63, _typeCase64, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_32) {
		try {
			_typeCase63 = (0, _typeCase94.default)($await_32, 'always', 'pascal-case'), _typeCase64 = (0, _slicedToArray3.default)(_typeCase63, 1);
			actual = _typeCase64[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase type should fail for "always start case"', t => new Promise(function ($return, $error) {
	var _typeCase65, _typeCase66, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_33) {
		try {
			_typeCase65 = (0, _typeCase94.default)($await_33, 'always', 'start-case'), _typeCase66 = (0, _slicedToArray3.default)(_typeCase65, 1);
			actual = _typeCase66[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase type should fail for "always uppercase"', t => new Promise(function ($return, $error) {
	var _typeCase67, _typeCase68, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_34) {
		try {
			_typeCase67 = (0, _typeCase94.default)($await_34, 'always', 'uppercase'), _typeCase68 = (0, _slicedToArray3.default)(_typeCase67, 1);
			actual = _typeCase68[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase type should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _typeCase69, _typeCase70, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_35) {
		try {
			_typeCase69 = (0, _typeCase94.default)($await_35, 'never', 'uppercase'), _typeCase70 = (0, _slicedToArray3.default)(_typeCase69, 1);
			actual = _typeCase70[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase type should fail for "always camelcase"', t => new Promise(function ($return, $error) {
	var _typeCase71, _typeCase72, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_36) {
		try {
			_typeCase71 = (0, _typeCase94.default)($await_36, 'always', 'camel-case'), _typeCase72 = (0, _slicedToArray3.default)(_typeCase71, 1);
			actual = _typeCase72[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase type should fail for "always kebabcase"', t => new Promise(function ($return, $error) {
	var _typeCase73, _typeCase74, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_37) {
		try {
			_typeCase73 = (0, _typeCase94.default)($await_37, 'always', 'kebab-case'), _typeCase74 = (0, _slicedToArray3.default)(_typeCase73, 1);
			actual = _typeCase74[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase type should fail for "always snakecase"', t => new Promise(function ($return, $error) {
	var _typeCase75, _typeCase76, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_38) {
		try {
			_typeCase75 = (0, _typeCase94.default)($await_38, 'always', 'snake-case'), _typeCase76 = (0, _slicedToArray3.default)(_typeCase75, 1);
			actual = _typeCase76[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase type should fail for "always pascalcase"', t => new Promise(function ($return, $error) {
	var _typeCase77, _typeCase78, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_39) {
		try {
			_typeCase77 = (0, _typeCase94.default)($await_39, 'always', 'pascal-case'), _typeCase78 = (0, _slicedToArray3.default)(_typeCase77, 1);
			actual = _typeCase78[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase type should succeed for "always startcase"', t => new Promise(function ($return, $error) {
	var _typeCase79, _typeCase80, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_40) {
		try {
			_typeCase79 = (0, _typeCase94.default)($await_40, 'always', 'start-case'), _typeCase80 = (0, _slicedToArray3.default)(_typeCase79, 1);
			actual = _typeCase80[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with uppercase scope should succeed for "always [uppercase, lowercase]"', t => new Promise(function ($return, $error) {
	var _typeCase81, _typeCase82, actual, expected;

	return Promise.resolve(parsed.uppercase).then(function ($await_41) {
		try {
			_typeCase81 = (0, _typeCase94.default)($await_41, 'always', ['uppercase', 'lowercase']), _typeCase82 = (0, _slicedToArray3.default)(_typeCase81, 1);
			actual = _typeCase82[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with lowercase subject should succeed for "always [uppercase, lowercase]"', t => new Promise(function ($return, $error) {
	var _typeCase83, _typeCase84, actual, expected;

	return Promise.resolve(parsed.lowercase).then(function ($await_42) {
		try {
			_typeCase83 = (0, _typeCase94.default)($await_42, 'always', ['uppercase', 'lowercase']), _typeCase84 = (0, _slicedToArray3.default)(_typeCase83, 1);
			actual = _typeCase84[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase subject should fail for "always [uppercase, lowercase]"', t => new Promise(function ($return, $error) {
	var _typeCase85, _typeCase86, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_43) {
		try {
			_typeCase85 = (0, _typeCase94.default)($await_43, 'always', ['uppercase', 'lowercase']), _typeCase86 = (0, _slicedToArray3.default)(_typeCase85, 1);
			actual = _typeCase86[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase subject should pass for "always [uppercase, lowercase, camel-case]"', t => new Promise(function ($return, $error) {
	var _typeCase87, _typeCase88, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_44) {
		try {
			_typeCase87 = (0, _typeCase94.default)($await_44, 'always', ['uppercase', 'lowercase', 'camel-case']), _typeCase88 = (0, _slicedToArray3.default)(_typeCase87, 1);
			actual = _typeCase88[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase scope should pass for "never [uppercase, lowercase]"', t => new Promise(function ($return, $error) {
	var _typeCase89, _typeCase90, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_45) {
		try {
			_typeCase89 = (0, _typeCase94.default)($await_45, 'never', ['uppercase', 'lowercase']), _typeCase90 = (0, _slicedToArray3.default)(_typeCase89, 1);
			actual = _typeCase90[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with uppercase scope should fail for "never [uppercase, lowercase]"', t => new Promise(function ($return, $error) {
	var _typeCase91, _typeCase92, actual, expected;

	return Promise.resolve(parsed.uppercase).then(function ($await_46) {
		try {
			_typeCase91 = (0, _typeCase94.default)($await_46, 'never', ['uppercase', 'lowercase']), _typeCase92 = (0, _slicedToArray3.default)(_typeCase91, 1);
			actual = _typeCase92[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));
//# sourceMappingURL=type-case.test.js.map