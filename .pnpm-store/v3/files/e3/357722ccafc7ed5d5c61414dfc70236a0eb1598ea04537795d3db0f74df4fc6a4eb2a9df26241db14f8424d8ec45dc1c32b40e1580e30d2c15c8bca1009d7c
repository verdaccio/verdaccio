'use strict';
const escapeStringRegexp = require('escape-string-regexp');

const reCache = new Map();

function makeRe(pattern, options) {
	const opts = Object.assign({
		caseSensitive: false
	}, options);

	const cacheKey = pattern + JSON.stringify(opts);

	if (reCache.has(cacheKey)) {
		return reCache.get(cacheKey);
	}

	const negated = pattern[0] === '!';

	if (negated) {
		pattern = pattern.slice(1);
	}

	pattern = escapeStringRegexp(pattern).replace(/\\\*/g, '.*');

	const re = new RegExp(`^${pattern}$`, opts.caseSensitive ? '' : 'i');
	re.negated = negated;
	reCache.set(cacheKey, re);

	return re;
}

module.exports = (inputs, patterns, options) => {
	if (!(Array.isArray(inputs) && Array.isArray(patterns))) {
		throw new TypeError(`Expected two arrays, got ${typeof inputs} ${typeof patterns}`);
	}

	if (patterns.length === 0) {
		return inputs;
	}

	const firstNegated = patterns[0][0] === '!';

	patterns = patterns.map(x => makeRe(x, options));

	const ret = [];

	for (const input of inputs) {
		// If first pattern is negated we include everything to match user expectation
		let matches = firstNegated;

		for (const pattern of patterns) {
			if (pattern.test(input)) {
				matches = !pattern.negated;
			}
		}

		if (matches) {
			ret.push(input);
		}
	}

	return ret;
};

module.exports.isMatch = (input, pattern, options) => {
	const re = makeRe(pattern, options);
	const matches = re.test(input);
	return re.negated ? !matches : matches;
};
