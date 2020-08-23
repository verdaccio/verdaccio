'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _conventionalChangelogAngular = require('conventional-changelog-angular');

var _conventionalChangelogAngular2 = _interopRequireDefault(_conventionalChangelogAngular);

var _parse = require('@commitlint/parse');

var _parse2 = _interopRequireDefault(_parse);

var _referencesEmpty19 = require('./references-empty');

var _referencesEmpty20 = _interopRequireDefault(_referencesEmpty19);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const messages = {
	plain: 'foo: bar',
	comment: 'foo: baz\n#1 Comment',
	reference: '#comment\nfoo: baz \nCloses #1',
	references: '#comment\nfoo: bar \nCloses #1, #2, #3',
	prefix: 'bar REF-1234'
};

const opts = (() => new Promise(function ($return, $error) {
	var o;
	return Promise.resolve(_conventionalChangelogAngular2.default).then(function ($await_1) {
		try {
			o = $await_1;

			o.parserOpts.commentChar = '#';
			return $return(o);
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)))();

const parsed = {
	plain: (() => new Promise(function ($return, $error) {
		return Promise.resolve(opts).then(function ($await_2) {
			try {
				return $return((0, _parse2.default)(messages.plain, undefined, $await_2.parserOpts));
			} catch ($boundEx) {
				return $error($boundEx);
			}
		}.bind(this), $error);
	}.bind(this)))(),
	comment: (() => new Promise(function ($return, $error) {
		return Promise.resolve(opts).then(function ($await_3) {
			try {
				return $return((0, _parse2.default)(messages.comment, undefined, $await_3.parserOpts));
			} catch ($boundEx) {
				return $error($boundEx);
			}
		}.bind(this), $error);
	}.bind(this)))(),
	reference: (() => new Promise(function ($return, $error) {
		return Promise.resolve(opts).then(function ($await_4) {
			try {
				return $return((0, _parse2.default)(messages.reference, undefined, $await_4.parserOpts));
			} catch ($boundEx) {
				return $error($boundEx);
			}
		}.bind(this), $error);
	}.bind(this)))(),
	references: (() => new Promise(function ($return, $error) {
		return Promise.resolve(opts).then(function ($await_5) {
			try {
				return $return((0, _parse2.default)(messages.references, undefined, $await_5.parserOpts));
			} catch ($boundEx) {
				return $error($boundEx);
			}
		}.bind(this), $error);
	}.bind(this)))(),
	prefix: (0, _parse2.default)(messages.prefix, undefined, {
		issuePrefixes: ['REF-']
	})
};

(0, _ava2.default)('defaults to never and fails for plain', t => new Promise(function ($return, $error) {
	var _referencesEmpty, _referencesEmpty2, actual, expected;

	return Promise.resolve(parsed.plain).then(function ($await_6) {
		try {
			_referencesEmpty = (0, _referencesEmpty20.default)($await_6), _referencesEmpty2 = (0, _slicedToArray3.default)(_referencesEmpty, 1);
			actual = _referencesEmpty2[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('defaults to never and succeeds for reference', t => new Promise(function ($return, $error) {
	var _referencesEmpty3, _referencesEmpty4, actual, expected;

	return Promise.resolve(parsed.reference).then(function ($await_7) {
		try {
			_referencesEmpty3 = (0, _referencesEmpty20.default)($await_7), _referencesEmpty4 = (0, _slicedToArray3.default)(_referencesEmpty3, 1);
			actual = _referencesEmpty4[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('fails for comment with never', t => new Promise(function ($return, $error) {
	var _referencesEmpty5, _referencesEmpty6, actual, expected;

	return Promise.resolve(parsed.comment).then(function ($await_8) {
		try {
			_referencesEmpty5 = (0, _referencesEmpty20.default)($await_8, 'never'), _referencesEmpty6 = (0, _slicedToArray3.default)(_referencesEmpty5, 1);
			actual = _referencesEmpty6[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('succeeds for comment with always', t => new Promise(function ($return, $error) {
	var _referencesEmpty7, _referencesEmpty8, actual, expected;

	return Promise.resolve(parsed.comment).then(function ($await_9) {
		try {
			_referencesEmpty7 = (0, _referencesEmpty20.default)($await_9, 'always'), _referencesEmpty8 = (0, _slicedToArray3.default)(_referencesEmpty7, 1);
			actual = _referencesEmpty8[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('succeeds for reference with never', t => new Promise(function ($return, $error) {
	var _referencesEmpty9, _referencesEmpty10, actual, expected;

	return Promise.resolve(parsed.reference).then(function ($await_10) {
		try {
			_referencesEmpty9 = (0, _referencesEmpty20.default)($await_10, 'never'), _referencesEmpty10 = (0, _slicedToArray3.default)(_referencesEmpty9, 1);
			actual = _referencesEmpty10[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('fails for reference with always', t => new Promise(function ($return, $error) {
	var _referencesEmpty11, _referencesEmpty12, actual, expected;

	return Promise.resolve(parsed.reference).then(function ($await_11) {
		try {
			_referencesEmpty11 = (0, _referencesEmpty20.default)($await_11, 'always'), _referencesEmpty12 = (0, _slicedToArray3.default)(_referencesEmpty11, 1);
			actual = _referencesEmpty12[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('succeeds for references with never', t => new Promise(function ($return, $error) {
	var _referencesEmpty13, _referencesEmpty14, actual, expected;

	return Promise.resolve(parsed.references).then(function ($await_12) {
		try {
			_referencesEmpty13 = (0, _referencesEmpty20.default)($await_12, 'never'), _referencesEmpty14 = (0, _slicedToArray3.default)(_referencesEmpty13, 1);
			actual = _referencesEmpty14[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('fails for references with always', t => new Promise(function ($return, $error) {
	var _referencesEmpty15, _referencesEmpty16, actual, expected;

	return Promise.resolve(parsed.references).then(function ($await_13) {
		try {
			_referencesEmpty15 = (0, _referencesEmpty20.default)($await_13, 'always'), _referencesEmpty16 = (0, _slicedToArray3.default)(_referencesEmpty15, 1);
			actual = _referencesEmpty16[0];
			expected = false;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('succeeds for custom references with always', t => new Promise(function ($return, $error) {
	var _referencesEmpty17, _referencesEmpty18, actual, expected;

	return Promise.resolve(parsed.prefix).then(function ($await_14) {
		try {
			_referencesEmpty17 = (0, _referencesEmpty20.default)($await_14, 'never'), _referencesEmpty18 = (0, _slicedToArray3.default)(_referencesEmpty17, 1);
			actual = _referencesEmpty18[0];
			expected = true;

			t.is(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));
//# sourceMappingURL=references-empty.test.js.map