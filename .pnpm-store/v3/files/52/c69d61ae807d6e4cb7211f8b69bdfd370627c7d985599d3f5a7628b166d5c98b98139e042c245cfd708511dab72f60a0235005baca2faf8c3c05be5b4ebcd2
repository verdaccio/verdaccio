'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _globby = require('globby');

var _globby2 = _interopRequireDefault(_globby);

var _lodash = require('lodash');

var _ = require('.');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _ava2.default)('exports all rules', t => new Promise(function ($return, $error) {
	var expected, actual;
	return Promise.resolve(glob('*.js')).then(function ($await_1) {
		try {
			expected = $await_1.sort();
			actual = Object.keys(_2.default).sort();

			t.deepEqual(actual, expected);
			return $return();
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('rules export functions', t => {
	const actual = (0, _lodash.values)(_2.default);
	t.true(actual.every(rule => typeof rule === 'function'));
});

function glob(pattern) {
	return new Promise(function ($return, $error) {
		var files;
		return Promise.resolve((0, _globby2.default)([_path2.default.join(__dirname, pattern)], {
			ignore: ['**/index.js', '**/*.test.js'],
			cwd: __dirname
		})).then(function ($await_2) {
			try {
				files = $await_2;

				return $return(files.map(relative).map(toExport));
			} catch ($boundEx) {
				return $error($boundEx);
			}
		}.bind(this), $error);
	}.bind(this));
}

function relative(filePath) {
	return _path2.default.relative(__dirname, filePath);
}

function toExport(fileName) {
	return _path2.default.basename(fileName, _path2.default.extname(fileName));
}
//# sourceMappingURL=index.test.js.map