'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gitRawCommits = require('git-raw-commits');

var _gitRawCommits2 = _interopRequireDefault(_gitRawCommits);

var _sander = require('@marionebl/sander');

var sander = _interopRequireWildcard(_sander);

var _topLevel = require('@commitlint/top-level');

var _topLevel2 = _interopRequireDefault(_topLevel);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = getCommitMessages;

// Get commit messages
// Object => Promise<Array<String>>

function getCommitMessages(settings) {
	return new Promise(function ($return, $error) {
		const cwd = settings.cwd,
		      from = settings.from,
		      to = settings.to,
		      edit = settings.edit;


		if (edit) {
			return $return(getEditCommit(cwd, edit));
		}

		return $return(getHistoryCommits({ from, to }, { cwd }));
	}.bind(this));
}

// Get commit messages from history
// Object => Promise<string[]>
function getHistoryCommits(options, opts = {}) {
	return new Promise((resolve, reject) => {
		const data = [];
		(0, _gitRawCommits2.default)(options, { cwd: opts.cwd }).on('data', chunk => data.push(chunk.toString('utf-8'))).on('error', reject).on('end', () => {
			resolve(data);
		});
	});
}

// Get recently edited commit message
// (cwd: string, edit: any) => Promise<Array<String>>
function getEditCommit(cwd, edit) {
	return new Promise(function ($return, $error) {
		var top, editFilePath, editFile;
		return Promise.resolve((0, _topLevel2.default)(cwd)).then(function ($await_3) {
			try {
				top = $await_3;


				if (typeof top !== 'string') {
					return $error(new TypeError(`Could not find git root from ${cwd}`));
				}

				return Promise.resolve(getEditFilePath(top, edit)).then(function ($await_4) {
					try {
						editFilePath = $await_4;
						return Promise.resolve(sander.readFile(editFilePath)).then(function ($await_5) {
							try {
								editFile = $await_5;

								return $return([`${editFile.toString('utf-8')}\n`]);
							} catch ($boundEx) {
								return $error($boundEx);
							}
						}.bind(this), $error);
					} catch ($boundEx) {
						return $error($boundEx);
					}
				}.bind(this), $error);
			} catch ($boundEx) {
				return $error($boundEx);
			}
		}.bind(this), $error);
	}.bind(this));
}

// Get path to recently edited commit message file
// (top: string, edit: any) => Promise<String>
function getEditFilePath(top, edit) {
	return new Promise(function ($return, $error) {
		var dotgitPath, dotgitStats, gitFile, relativeGitPath;
		let editFilePath;

		if (typeof edit === 'string') {
			editFilePath = _path2.default.resolve(top, edit);
			return $If_1.call(this);
		} else {
			dotgitPath = _path2.default.join(top, '.git');
			dotgitStats = sander.lstatSync(dotgitPath);

			if (dotgitStats.isDirectory()) {
				editFilePath = _path2.default.join(top, '.git/COMMIT_EDITMSG');
				return $If_2.call(this);
			} else {
				return Promise.resolve(sander.readFile(dotgitPath, { encoding: 'utf-8' })).then(function ($await_6) {
					try {
						gitFile = $await_6;
						relativeGitPath = gitFile.replace('gitdir: ', '').replace('\n', '');

						editFilePath = _path2.default.resolve(top, relativeGitPath, 'COMMIT_EDITMSG');
						return $If_2.call(this);
					} catch ($boundEx) {
						return $error($boundEx);
					}
				}.bind(this), $error);
			}

			function $If_2() {
				return $If_1.call(this);
			}
		}

		function $If_1() {
			return $return(editFilePath);
		}
	}.bind(this));
}
module.exports = exports.default;
//# sourceMappingURL=index.js.map