'use strict';

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _ = require('.');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _ava2.default)('throws without params', t => new Promise(function ($return, $error) {
	var error;
	return Promise.resolve(t.throws((0, _2.default)())).then(function ($await_1) {
		try {
			error = $await_1;

			t.is(error.message, 'Expected a raw commit');
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('throws with empty message', t => new Promise(function ($return, $error) {
	var error;
	return Promise.resolve(t.throws((0, _2.default)(''))).then(function ($await_2) {
		try {
			error = $await_2;

			t.is(error.message, 'Expected a raw commit');
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('positive on stub message and no rule', t => new Promise(function ($return, $error) {
	var actual;
	return Promise.resolve((0, _2.default)('foo: bar')).then(function ($await_3) {
		try {
			actual = $await_3;

			t.true(actual.valid);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('positive on stub message and adhered rule', t => new Promise(function ($return, $error) {
	var actual;
	return Promise.resolve((0, _2.default)('foo: bar', {
		'type-enum': [2, 'always', ['foo']]
	})).then(function ($await_4) {
		try {
			actual = $await_4;

			t.true(actual.valid);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('negative on stub message and broken rule', t => new Promise(function ($return, $error) {
	var actual;
	return Promise.resolve((0, _2.default)('foo: bar', {
		'type-enum': [2, 'never', ['foo']]
	})).then(function ($await_5) {
		try {
			actual = $await_5;

			t.false(actual.valid);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('positive on ignored message and broken rule', t => new Promise(function ($return, $error) {
	var actual;
	return Promise.resolve((0, _2.default)('Revert "some bogus commit"', {
		'type-empty': [2, 'never']
	})).then(function ($await_6) {
		try {
			actual = $await_6;

			t.true(actual.valid);
			t.is(actual.input, 'Revert "some bogus commit"');
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('negative on ignored message, disabled ignored messages and broken rule', t => new Promise(function ($return, $error) {
	var actual;
	return Promise.resolve((0, _2.default)('Revert "some bogus commit"', {
		'type-empty': [2, 'never']
	}, {
		defaultIgnores: false
	})).then(function ($await_7) {
		try {
			actual = $await_7;

			t.false(actual.valid);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('positive on custom ignored message and broken rule', t => new Promise(function ($return, $error) {
	var ignoredMessage, actual;
	ignoredMessage = 'some ignored custom message';
	return Promise.resolve((0, _2.default)(ignoredMessage, {
		'type-empty': [2, 'never']
	}, {
		ignores: [c => c === ignoredMessage]
	})).then(function ($await_8) {
		try {
			actual = $await_8;

			t.true(actual.valid);
			t.is(actual.input, ignoredMessage);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('positive on stub message and opts', t => new Promise(function ($return, $error) {
	var actual;
	return Promise.resolve((0, _2.default)('foo-bar', {
		'type-enum': [2, 'always', ['foo']],
		'type-empty': [2, 'never']
	}, {
		parserOpts: {
			headerPattern: /^(\w*)(?:\((.*)\))?-(.*)$/
		}
	})).then(function ($await_9) {
		try {
			actual = $await_9;

			t.true(actual.valid);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('throws for invalid rule names', t => new Promise(function ($return, $error) {
	var error;
	return Promise.resolve(t.throws((0, _2.default)('foo', { foo: [2, 'always'], bar: [1, 'never'] }))).then(function ($await_10) {
		try {
			error = $await_10;


			t.is(error.message.indexOf('Found invalid rule names: foo, bar'), 0);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('throws for invalid rule config', t => new Promise(function ($return, $error) {
	var error;
	return Promise.resolve(t.throws((0, _2.default)('type(scope): foo', {
		'type-enum': 1,
		'scope-enum': { 0: 2, 1: 'never', 2: ['foo'], length: 3 }
	}))).then(function ($await_11) {
		try {
			error = $await_11;


			t.true(error.message.indexOf('type-enum must be array') > -1);
			t.true(error.message.indexOf('scope-enum must be array') > -1);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('allows disable shorthand', t => new Promise(function ($return, $error) {
	return Promise.resolve(t.notThrows((0, _2.default)('foo', { 'type-enum': [0], 'scope-enum': [0] }))).then(function ($await_12) {
		try {
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('throws for rule with invalid length', t => new Promise(function ($return, $error) {
	var error;
	return Promise.resolve(t.throws((0, _2.default)('type(scope): foo', { 'scope-enum': [1, 2, 3, 4] }))).then(function ($await_13) {
		try {
			error = $await_13;


			t.true(error.message.indexOf('scope-enum must be 2 or 3 items long') > -1);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('throws for rule with invalid level', t => new Promise(function ($return, $error) {
	var error;
	return Promise.resolve(t.throws((0, _2.default)('type(scope): foo', {
		'type-enum': ['2', 'always'],
		'header-max-length': [{}, 'always']
	}))).then(function ($await_14) {
		try {
			error = $await_14;


			t.true(error.message.indexOf('rule type-enum must be number') > -1);
			t.true(error.message.indexOf('rule type-enum must be number') > -1);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('throws for rule with out of range level', t => new Promise(function ($return, $error) {
	var error;
	return Promise.resolve(t.throws((0, _2.default)('type(scope): foo', {
		'type-enum': [-1, 'always'],
		'header-max-length': [3, 'always']
	}))).then(function ($await_15) {
		try {
			error = $await_15;


			t.true(error.message.indexOf('rule type-enum must be between 0 and 2') > -1);
			t.true(error.message.indexOf('rule type-enum must be between 0 and 2') > -1);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('throws for rule with invalid condition', t => new Promise(function ($return, $error) {
	var error;
	return Promise.resolve(t.throws((0, _2.default)('type(scope): foo', {
		'type-enum': [1, 2],
		'header-max-length': [1, {}]
	}))).then(function ($await_16) {
		try {
			error = $await_16;


			t.true(error.message.indexOf('type-enum must be string') > -1);
			t.true(error.message.indexOf('header-max-length must be string') > -1);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('throws for rule with out of range condition', t => new Promise(function ($return, $error) {
	var error;
	return Promise.resolve(t.throws((0, _2.default)('type(scope): foo', {
		'type-enum': [1, 'foo'],
		'header-max-length': [1, 'bar']
	}))).then(function ($await_17) {
		try {
			error = $await_17;


			t.true(error.message.indexOf('type-enum must be "always" or "never"') > -1);
			t.true(error.message.indexOf('header-max-length must be "always" or "never"') > -1);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('succeds for issue', t => new Promise(function ($return, $error) {
	var report;
	return Promise.resolve((0, _2.default)('somehting #1', {
		'references-empty': [2, 'never']
	})).then(function ($await_18) {
		try {
			report = $await_18;


			t.true(report.valid);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('fails for issue', t => new Promise(function ($return, $error) {
	var report;
	return Promise.resolve((0, _2.default)('somehting #1', {
		'references-empty': [2, 'always']
	})).then(function ($await_19) {
		try {
			report = $await_19;


			t.false(report.valid);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('succeds for custom issue prefix', t => new Promise(function ($return, $error) {
	var report;
	return Promise.resolve((0, _2.default)('somehting REF-1', {
		'references-empty': [2, 'never']
	}, {
		parserOpts: {
			issuePrefixes: ['REF-']
		}
	})).then(function ($await_20) {
		try {
			report = $await_20;


			t.true(report.valid);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('fails for custom issue prefix', t => new Promise(function ($return, $error) {
	var report;
	return Promise.resolve((0, _2.default)('somehting #1', {
		'references-empty': [2, 'never']
	}, {
		parserOpts: {
			issuePrefixes: ['REF-']
		}
	})).then(function ($await_21) {
		try {
			report = $await_21;


			t.false(report.valid);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('fails for custom plugin rule', t => new Promise(function ($return, $error) {
	var report;
	return Promise.resolve((0, _2.default)('somehting #1', {
		'plugin-rule': [2, 'never']
	}, {
		plugins: {
			'plugin-example': {
				rules: {
					'plugin-rule': () => [false]
				}
			}
		}
	})).then(function ($await_22) {
		try {
			report = $await_22;


			t.false(report.valid);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('passes for custom plugin rule', t => new Promise(function ($return, $error) {
	var report;
	return Promise.resolve((0, _2.default)('somehting #1', {
		'plugin-rule': [2, 'never']
	}, {
		plugins: {
			'plugin-example': {
				rules: {
					'plugin-rule': () => [true]
				}
			}
		}
	})).then(function ($await_23) {
		try {
			report = $await_23;


			t.true(report.valid);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('returns original message only with commit header', t => new Promise(function ($return, $error) {
	var message, report;
	message = 'foo: bar';
	return Promise.resolve((0, _2.default)(message)).then(function ($await_24) {
		try {
			report = $await_24;


			t.is(report.input, message);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('returns original message with commit header and body', t => new Promise(function ($return, $error) {
	var message, report;
	message = 'foo: bar/n/nFoo bar bizz buzz.';
	return Promise.resolve((0, _2.default)(message)).then(function ($await_25) {
		try {
			report = $await_25;


			t.is(report.input, message);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('returns original message with commit header, body and footer', t => new Promise(function ($return, $error) {
	var message, report;
	message = 'foo: bar/n/nFoo bar bizz buzz./n/nCloses #1';
	return Promise.resolve((0, _2.default)(message)).then(function ($await_26) {
		try {
			report = $await_26;


			t.is(report.input, message);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('returns original message with commit header, body and footer, parsing comments', t => new Promise(function ($return, $error) {
	var expected, message, report;
	expected = 'foo: bar/n/nFoo bar bizz buzz./n/nCloses #1';
	message = `${expected}\n\n# Some comment to ignore`;
	return Promise.resolve((0, _2.default)(message, {
		'references-empty': [2, 'never']
	}, {
		parserOpts: {
			commentChar: '#'
		}
	})).then(function ($await_27) {
		try {
			report = $await_27;


			t.is(report.input, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));
//# sourceMappingURL=index.test.js.map