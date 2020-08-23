'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _parse = require('@commitlint/parse');

var _parse2 = _interopRequireDefault(_parse);

var _headerCase91 = require('./header-case');

var _headerCase92 = _interopRequireDefault(_headerCase91);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const messages = {
	numeric: '1.0.0\n',
	lowercase: 'header\n',
	mixedcase: 'hEaDeR\n',
	uppercase: 'HEADER\n',
	camelcase: 'heaDer\n',
	kebabcase: 'hea-der\n',
	pascalcase: 'HeaDer\n',
	snakecase: 'hea_der\n',
	startcase: 'Hea Der\n'
};

const parsed = {
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

(0, _ava2.default)('with lowercase header should fail for "never lowercase"', t => new Promise(function ($return, $error) {
	var _headerCase, _headerCase2, actual, expected;

	return Promise.resolve(parsed.lowercase).then(function ($await_1) {
		try {
			_headerCase = (0, _headerCase92.default)($await_1, 'never', 'lowercase'), _headerCase2 = (0, _slicedToArray3.default)(_headerCase, 1);
			actual = _headerCase2[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with lowercase header should succeed for "always lowercase"', t => new Promise(function ($return, $error) {
	var _headerCase3, _headerCase4, actual, expected;

	return Promise.resolve(parsed.lowercase).then(function ($await_2) {
		try {
			_headerCase3 = (0, _headerCase92.default)($await_2, 'always', 'lowercase'), _headerCase4 = (0, _slicedToArray3.default)(_headerCase3, 1);
			actual = _headerCase4[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase header should succeed for "never lowercase"', t => new Promise(function ($return, $error) {
	var _headerCase5, _headerCase6, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_3) {
		try {
			_headerCase5 = (0, _headerCase92.default)($await_3, 'never', 'lowercase'), _headerCase6 = (0, _slicedToArray3.default)(_headerCase5, 1);
			actual = _headerCase6[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase header should fail for "always lowercase"', t => new Promise(function ($return, $error) {
	var _headerCase7, _headerCase8, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_4) {
		try {
			_headerCase7 = (0, _headerCase92.default)($await_4, 'always', 'lowercase'), _headerCase8 = (0, _slicedToArray3.default)(_headerCase7, 1);
			actual = _headerCase8[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase header should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _headerCase9, _headerCase10, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_5) {
		try {
			_headerCase9 = (0, _headerCase92.default)($await_5, 'never', 'uppercase'), _headerCase10 = (0, _slicedToArray3.default)(_headerCase9, 1);
			actual = _headerCase10[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase header should fail for "always uppercase"', t => new Promise(function ($return, $error) {
	var _headerCase11, _headerCase12, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_6) {
		try {
			_headerCase11 = (0, _headerCase92.default)($await_6, 'always', 'uppercase'), _headerCase12 = (0, _slicedToArray3.default)(_headerCase11, 1);
			actual = _headerCase12[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with uppercase header should fail for "never uppercase"', t => new Promise(function ($return, $error) {
	var _headerCase13, _headerCase14, actual, expected;

	return Promise.resolve(parsed.uppercase).then(function ($await_7) {
		try {
			_headerCase13 = (0, _headerCase92.default)($await_7, 'never', 'uppercase'), _headerCase14 = (0, _slicedToArray3.default)(_headerCase13, 1);
			actual = _headerCase14[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with lowercase header should succeed for "always uppercase"', t => new Promise(function ($return, $error) {
	var _headerCase15, _headerCase16, actual, expected;

	return Promise.resolve(parsed.uppercase).then(function ($await_8) {
		try {
			_headerCase15 = (0, _headerCase92.default)($await_8, 'always', 'uppercase'), _headerCase16 = (0, _slicedToArray3.default)(_headerCase15, 1);
			actual = _headerCase16[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase header should fail for "always uppercase"', t => new Promise(function ($return, $error) {
	var _headerCase17, _headerCase18, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_9) {
		try {
			_headerCase17 = (0, _headerCase92.default)($await_9, 'always', 'uppercase'), _headerCase18 = (0, _slicedToArray3.default)(_headerCase17, 1);
			actual = _headerCase18[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase header should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _headerCase19, _headerCase20, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_10) {
		try {
			_headerCase19 = (0, _headerCase92.default)($await_10, 'never', 'uppercase'), _headerCase20 = (0, _slicedToArray3.default)(_headerCase19, 1);
			actual = _headerCase20[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase header should fail for "always pascalcase"', t => new Promise(function ($return, $error) {
	var _headerCase21, _headerCase22, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_11) {
		try {
			_headerCase21 = (0, _headerCase92.default)($await_11, 'always', 'pascal-case'), _headerCase22 = (0, _slicedToArray3.default)(_headerCase21, 1);
			actual = _headerCase22[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase header should fail for "always kebabcase"', t => new Promise(function ($return, $error) {
	var _headerCase23, _headerCase24, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_12) {
		try {
			_headerCase23 = (0, _headerCase92.default)($await_12, 'always', 'kebab-case'), _headerCase24 = (0, _slicedToArray3.default)(_headerCase23, 1);
			actual = _headerCase24[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase header should fail for "always snakecase"', t => new Promise(function ($return, $error) {
	var _headerCase25, _headerCase26, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_13) {
		try {
			_headerCase25 = (0, _headerCase92.default)($await_13, 'always', 'snake-case'), _headerCase26 = (0, _slicedToArray3.default)(_headerCase25, 1);
			actual = _headerCase26[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with camelcase header should succeed for "always camelcase"', t => new Promise(function ($return, $error) {
	var _headerCase27, _headerCase28, actual, expected;

	return Promise.resolve(parsed.camelcase).then(function ($await_14) {
		try {
			_headerCase27 = (0, _headerCase92.default)($await_14, 'always', 'camel-case'), _headerCase28 = (0, _slicedToArray3.default)(_headerCase27, 1);
			actual = _headerCase28[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase header should fail for "always uppercase"', t => new Promise(function ($return, $error) {
	var _headerCase29, _headerCase30, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_15) {
		try {
			_headerCase29 = (0, _headerCase92.default)($await_15, 'always', 'uppercase'), _headerCase30 = (0, _slicedToArray3.default)(_headerCase29, 1);
			actual = _headerCase30[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase header should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _headerCase31, _headerCase32, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_16) {
		try {
			_headerCase31 = (0, _headerCase92.default)($await_16, 'never', 'uppercase'), _headerCase32 = (0, _slicedToArray3.default)(_headerCase31, 1);
			actual = _headerCase32[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase header should succeed for "always pascalcase"', t => new Promise(function ($return, $error) {
	var _headerCase33, _headerCase34, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_17) {
		try {
			_headerCase33 = (0, _headerCase92.default)($await_17, 'always', 'pascal-case'), _headerCase34 = (0, _slicedToArray3.default)(_headerCase33, 1);
			actual = _headerCase34[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase header should fail for "always kebabcase"', t => new Promise(function ($return, $error) {
	var _headerCase35, _headerCase36, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_18) {
		try {
			_headerCase35 = (0, _headerCase92.default)($await_18, 'always', 'kebab-case'), _headerCase36 = (0, _slicedToArray3.default)(_headerCase35, 1);
			actual = _headerCase36[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase header should fail for "always snakecase"', t => new Promise(function ($return, $error) {
	var _headerCase37, _headerCase38, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_19) {
		try {
			_headerCase37 = (0, _headerCase92.default)($await_19, 'always', 'snake-case'), _headerCase38 = (0, _slicedToArray3.default)(_headerCase37, 1);
			actual = _headerCase38[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with pascalcase header should fail for "always camelcase"', t => new Promise(function ($return, $error) {
	var _headerCase39, _headerCase40, actual, expected;

	return Promise.resolve(parsed.pascalcase).then(function ($await_20) {
		try {
			_headerCase39 = (0, _headerCase92.default)($await_20, 'always', 'camel-case'), _headerCase40 = (0, _slicedToArray3.default)(_headerCase39, 1);
			actual = _headerCase40[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase header should fail for "always uppercase"', t => new Promise(function ($return, $error) {
	var _headerCase41, _headerCase42, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_21) {
		try {
			_headerCase41 = (0, _headerCase92.default)($await_21, 'always', 'uppercase'), _headerCase42 = (0, _slicedToArray3.default)(_headerCase41, 1);
			actual = _headerCase42[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase header should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _headerCase43, _headerCase44, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_22) {
		try {
			_headerCase43 = (0, _headerCase92.default)($await_22, 'never', 'uppercase'), _headerCase44 = (0, _slicedToArray3.default)(_headerCase43, 1);
			actual = _headerCase44[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase header should fail for "always pascalcase"', t => new Promise(function ($return, $error) {
	var _headerCase45, _headerCase46, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_23) {
		try {
			_headerCase45 = (0, _headerCase92.default)($await_23, 'always', 'pascal-case'), _headerCase46 = (0, _slicedToArray3.default)(_headerCase45, 1);
			actual = _headerCase46[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase header should fail for "always kebabcase"', t => new Promise(function ($return, $error) {
	var _headerCase47, _headerCase48, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_24) {
		try {
			_headerCase47 = (0, _headerCase92.default)($await_24, 'always', 'kebab-case'), _headerCase48 = (0, _slicedToArray3.default)(_headerCase47, 1);
			actual = _headerCase48[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase header should succeed for "always snakecase"', t => new Promise(function ($return, $error) {
	var _headerCase49, _headerCase50, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_25) {
		try {
			_headerCase49 = (0, _headerCase92.default)($await_25, 'always', 'snake-case'), _headerCase50 = (0, _slicedToArray3.default)(_headerCase49, 1);
			actual = _headerCase50[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with snakecase header should fail for "always camelcase"', t => new Promise(function ($return, $error) {
	var _headerCase51, _headerCase52, actual, expected;

	return Promise.resolve(parsed.snakecase).then(function ($await_26) {
		try {
			_headerCase51 = (0, _headerCase92.default)($await_26, 'always', 'camel-case'), _headerCase52 = (0, _slicedToArray3.default)(_headerCase51, 1);
			actual = _headerCase52[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase header should fail for "always uppercase"', t => new Promise(function ($return, $error) {
	var _headerCase53, _headerCase54, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_27) {
		try {
			_headerCase53 = (0, _headerCase92.default)($await_27, 'always', 'uppercase'), _headerCase54 = (0, _slicedToArray3.default)(_headerCase53, 1);
			actual = _headerCase54[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase header should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _headerCase55, _headerCase56, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_28) {
		try {
			_headerCase55 = (0, _headerCase92.default)($await_28, 'never', 'uppercase'), _headerCase56 = (0, _slicedToArray3.default)(_headerCase55, 1);
			actual = _headerCase56[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase header should fail for "always pascalcase"', t => new Promise(function ($return, $error) {
	var _headerCase57, _headerCase58, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_29) {
		try {
			_headerCase57 = (0, _headerCase92.default)($await_29, 'always', 'pascal-case'), _headerCase58 = (0, _slicedToArray3.default)(_headerCase57, 1);
			actual = _headerCase58[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase header should fail for "always kebabcase"', t => new Promise(function ($return, $error) {
	var _headerCase59, _headerCase60, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_30) {
		try {
			_headerCase59 = (0, _headerCase92.default)($await_30, 'always', 'kebab-case'), _headerCase60 = (0, _slicedToArray3.default)(_headerCase59, 1);
			actual = _headerCase60[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase header should fail for "always snakecase"', t => new Promise(function ($return, $error) {
	var _headerCase61, _headerCase62, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_31) {
		try {
			_headerCase61 = (0, _headerCase92.default)($await_31, 'always', 'snake-case'), _headerCase62 = (0, _slicedToArray3.default)(_headerCase61, 1);
			actual = _headerCase62[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase header should fail for "always camelcase"', t => new Promise(function ($return, $error) {
	var _headerCase63, _headerCase64, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_32) {
		try {
			_headerCase63 = (0, _headerCase92.default)($await_32, 'always', 'camel-case'), _headerCase64 = (0, _slicedToArray3.default)(_headerCase63, 1);
			actual = _headerCase64[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with startcase header should succeed for "always startcase"', t => new Promise(function ($return, $error) {
	var _headerCase65, _headerCase66, actual, expected;

	return Promise.resolve(parsed.startcase).then(function ($await_33) {
		try {
			_headerCase65 = (0, _headerCase92.default)($await_33, 'always', 'start-case'), _headerCase66 = (0, _slicedToArray3.default)(_headerCase65, 1);
			actual = _headerCase66[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('should use expected message with "always"', t => new Promise(function ($return, $error) {
	var _headerCase67, _headerCase68, message;

	return Promise.resolve(parsed.uppercase).then(function ($await_34) {
		try {
			_headerCase67 = (0, _headerCase92.default)($await_34, 'always', 'lower-case'), _headerCase68 = (0, _slicedToArray3.default)(_headerCase67, 2);
			message = _headerCase68[1];

			t.true(message.indexOf('must be lower-case') > -1);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('should use expected message with "never"', t => new Promise(function ($return, $error) {
	var _headerCase69, _headerCase70, message;

	return Promise.resolve(parsed.uppercase).then(function ($await_35) {
		try {
			_headerCase69 = (0, _headerCase92.default)($await_35, 'never', 'upper-case'), _headerCase70 = (0, _slicedToArray3.default)(_headerCase69, 2);
			message = _headerCase70[1];

			t.true(message.indexOf('must not be upper-case') > -1);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with uppercase scope should succeed for "always [uppercase, lowercase]"', t => new Promise(function ($return, $error) {
	var _headerCase71, _headerCase72, actual, expected;

	return Promise.resolve(parsed.uppercase).then(function ($await_36) {
		try {
			_headerCase71 = (0, _headerCase92.default)($await_36, 'always', ['uppercase', 'lowercase']), _headerCase72 = (0, _slicedToArray3.default)(_headerCase71, 1);
			actual = _headerCase72[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with lowercase header should succeed for "always [uppercase, lowercase]"', t => new Promise(function ($return, $error) {
	var _headerCase73, _headerCase74, actual, expected;

	return Promise.resolve(parsed.lowercase).then(function ($await_37) {
		try {
			_headerCase73 = (0, _headerCase92.default)($await_37, 'always', ['uppercase', 'lowercase']), _headerCase74 = (0, _slicedToArray3.default)(_headerCase73, 1);
			actual = _headerCase74[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase header should fail for "always [uppercase, lowercase]"', t => new Promise(function ($return, $error) {
	var _headerCase75, _headerCase76, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_38) {
		try {
			_headerCase75 = (0, _headerCase92.default)($await_38, 'always', ['uppercase', 'lowercase']), _headerCase76 = (0, _slicedToArray3.default)(_headerCase75, 1);
			actual = _headerCase76[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase header should pass for "always [uppercase, lowercase, camel-case]"', t => new Promise(function ($return, $error) {
	var _headerCase77, _headerCase78, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_39) {
		try {
			_headerCase77 = (0, _headerCase92.default)($await_39, 'always', ['uppercase', 'lowercase', 'camel-case']), _headerCase78 = (0, _slicedToArray3.default)(_headerCase77, 1);
			actual = _headerCase78[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with mixedcase scope should pass for "never [uppercase, lowercase]"', t => new Promise(function ($return, $error) {
	var _headerCase79, _headerCase80, actual, expected;

	return Promise.resolve(parsed.mixedcase).then(function ($await_40) {
		try {
			_headerCase79 = (0, _headerCase92.default)($await_40, 'never', ['uppercase', 'lowercase']), _headerCase80 = (0, _slicedToArray3.default)(_headerCase79, 1);
			actual = _headerCase80[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with uppercase scope should fail for "never [uppercase, lowercase]"', t => new Promise(function ($return, $error) {
	var _headerCase81, _headerCase82, actual, expected;

	return Promise.resolve(parsed.uppercase).then(function ($await_41) {
		try {
			_headerCase81 = (0, _headerCase92.default)($await_41, 'never', ['uppercase', 'lowercase']), _headerCase82 = (0, _slicedToArray3.default)(_headerCase81, 1);
			actual = _headerCase82[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with numeric header should succeed for "never lowercase"', t => new Promise(function ($return, $error) {
	var _headerCase83, _headerCase84, actual, expected;

	return Promise.resolve(parsed.numeric).then(function ($await_42) {
		try {
			_headerCase83 = (0, _headerCase92.default)($await_42, 'never', 'lowercase'), _headerCase84 = (0, _slicedToArray3.default)(_headerCase83, 1);
			actual = _headerCase84[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with numeric header should succeed for "always lowercase"', t => new Promise(function ($return, $error) {
	var _headerCase85, _headerCase86, actual, expected;

	return Promise.resolve(parsed.numeric).then(function ($await_43) {
		try {
			_headerCase85 = (0, _headerCase92.default)($await_43, 'always', 'lowercase'), _headerCase86 = (0, _slicedToArray3.default)(_headerCase85, 1);
			actual = _headerCase86[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with numeric header should succeed for "never uppercase"', t => new Promise(function ($return, $error) {
	var _headerCase87, _headerCase88, actual, expected;

	return Promise.resolve(parsed.numeric).then(function ($await_44) {
		try {
			_headerCase87 = (0, _headerCase92.default)($await_44, 'never', 'uppercase'), _headerCase88 = (0, _slicedToArray3.default)(_headerCase87, 1);
			actual = _headerCase88[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('with numeric header should succeed for "always uppercase"', t => new Promise(function ($return, $error) {
	var _headerCase89, _headerCase90, actual, expected;

	return Promise.resolve(parsed.numeric).then(function ($await_45) {
		try {
			_headerCase89 = (0, _headerCase92.default)($await_45, 'always', 'uppercase'), _headerCase90 = (0, _slicedToArray3.default)(_headerCase89, 1);
			actual = _headerCase90[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));
//# sourceMappingURL=header-case.test.js.map