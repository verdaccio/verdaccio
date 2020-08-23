'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _isIgnored = require('@commitlint/is-ignored');

var _isIgnored2 = _interopRequireDefault(_isIgnored);

var _parse = require('@commitlint/parse');

var _parse2 = _interopRequireDefault(_parse);

var _rules = require('@commitlint/rules');

var _rules2 = _interopRequireDefault(_rules);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const buildCommitMesage = ({ header, body, footer }) => {
	let message = header;

	message = body ? `${message}\n\n${body}` : message;
	message = footer ? `${message}\n\n${footer}` : message;

	return message;
};

exports.default = (message, rules = {}, opts = {}) => new Promise(function ($return, $error) {
	var parsed, mergedImplementations, missing, names, invalid, results, errors, warnings, valid;

	// Found a wildcard match, skip
	if ((0, _isIgnored2.default)(message, { defaults: opts.defaultIgnores, ignores: opts.ignores })) {
		return $return({
			valid: true,
			errors: [],
			warnings: [],
			input: message
		});
	}

	// Parse the commit message
	return Promise.resolve((0, _parse2.default)(message, undefined, opts.parserOpts)).then(function ($await_1) {
		try {
			parsed = $await_1;
			mergedImplementations = Object.assign({}, _rules2.default);

			if (opts.plugins) {
				(0, _lodash.values)(opts.plugins).forEach(plugin => {
					if (plugin.rules) {
						Object.keys(plugin.rules).forEach(ruleKey => {
							mergedImplementations[ruleKey] = plugin.rules[ruleKey];
						});
					}
				});
			}

			// Find invalid rules configs
			missing = Object.keys(rules).filter(name => typeof mergedImplementations[name] !== 'function');


			if (missing.length > 0) {
				names = Object.keys(mergedImplementations);

				return $error(new RangeError(`Found invalid rule names: ${missing.join(', ')}. Supported rule names are: ${names.join(', ')}`));
			}

			invalid = (0, _lodash.toPairs)(rules).map(([name, config]) => {
				if (!Array.isArray(config)) {
					return new Error(`config for rule ${name} must be array, received ${_util2.default.inspect(config)} of type ${typeof config}`);
				}

				var _config = (0, _slicedToArray3.default)(config, 2);

				const level = _config[0],
				      when = _config[1];


				if (typeof level !== 'number' || isNaN(level)) {
					return new Error(`level for rule ${name} must be number, received ${_util2.default.inspect(level)} of type ${typeof level}`);
				}

				if (level === 0 && config.length === 1) {
					return null;
				}

				if (config.length !== 2 && config.length !== 3) {
					return new Error(`config for rule ${name} must be 2 or 3 items long, received ${_util2.default.inspect(config)} of length ${config.length}`);
				}

				if (level < 0 || level > 2) {
					return new RangeError(`level for rule ${name} must be between 0 and 2, received ${_util2.default.inspect(level)}`);
				}

				if (typeof when !== 'string') {
					return new Error(`condition for rule ${name} must be string, received ${_util2.default.inspect(when)} of type ${typeof when}`);
				}

				if (when !== 'never' && when !== 'always') {
					return new Error(`condition for rule ${name} must be "always" or "never", received ${_util2.default.inspect(when)}`);
				}

				return null;
			}).filter(item => item instanceof Error);


			if (invalid.length > 0) {
				return $error(new Error(invalid.map(i => i.message).join('\n')));
			}

			// Validate against all rules
			results = (0, _lodash.toPairs)(rules).filter(entry => {
				var _toPairs = (0, _lodash.toPairs)(entry),
				    _toPairs2 = (0, _slicedToArray3.default)(_toPairs, 2),
				    _toPairs2$ = (0, _slicedToArray3.default)(_toPairs2[1], 1);

				const level = _toPairs2$[0];

				return level > 0;
			}).map(entry => {
				var _entry = (0, _slicedToArray3.default)(entry, 2);

				const name = _entry[0],
				      config = _entry[1];

				var _config2 = (0, _slicedToArray3.default)(config, 3);

				const level = _config2[0],
				      when = _config2[1],
				      value = _config2[2];

				// Level 0 rules are ignored

				if (level === 0) {
					return null;
				}

				const rule = mergedImplementations[name];

				var _rule = rule(parsed, when, value),
				    _rule2 = (0, _slicedToArray3.default)(_rule, 2);

				const valid = _rule2[0],
				      message = _rule2[1];


				return {
					level,
					valid,
					name,
					message
				};
			}).filter(Boolean);
			errors = results.filter(result => result.level === 2 && !result.valid);
			warnings = results.filter(result => result.level === 1 && !result.valid);
			valid = errors.length === 0;


			return $return({
				valid,
				errors,
				warnings,
				input: buildCommitMesage(parsed)
			});
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this));

module.exports = exports.default;
//# sourceMappingURL=index.js.map