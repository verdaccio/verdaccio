'use strict';

var _test = require('@commitlint/test');

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

var _sander = require('@marionebl/sander');

var sander = _interopRequireWildcard(_sander);

var _ = require('.');

var _2 = _interopRequireDefault(_);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _ava2.default)('get edit commit message specified by the `edit` flag', t => new Promise(function ($return, $error) {
	var cwd, expected, actual;
	return Promise.resolve(_test.git.bootstrap()).then(function ($await_1) {
		try {
			cwd = $await_1;
			return Promise.resolve(sander.writeFile(cwd, 'commit-msg-file', 'foo')).then(function ($await_2) {
				try {
					expected = ['foo\n'];
					return Promise.resolve((0, _2.default)({ edit: 'commit-msg-file', cwd })).then(function ($await_3) {
						try {
							actual = $await_3;

							t.deepEqual(actual, expected);
							return $return();
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
}.bind(this)));

(0, _ava2.default)('get edit commit message from git root', t => new Promise(function ($return, $error) {
	var cwd, expected, actual;
	return Promise.resolve(_test.git.bootstrap()).then(function ($await_4) {
		try {
			cwd = $await_4;
			return Promise.resolve(sander.writeFile(cwd, 'alpha.txt', 'alpha')).then(function ($await_5) {
				try {
					return Promise.resolve((0, _execa2.default)('git', ['add', '.'], { cwd })).then(function ($await_6) {
						try {
							return Promise.resolve((0, _execa2.default)('git', ['commit', '-m', 'alpha'], { cwd })).then(function ($await_7) {
								try {
									expected = ['alpha\n\n'];
									return Promise.resolve((0, _2.default)({ edit: true, cwd })).then(function ($await_8) {
										try {
											actual = $await_8;

											t.deepEqual(actual, expected);
											return $return();
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
				} catch ($boundEx) {
					return $error($boundEx);
				}
			}.bind(this), $error);
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('get history commit messages', t => new Promise(function ($return, $error) {
	var cwd, expected, actual;
	return Promise.resolve(_test.git.bootstrap()).then(function ($await_9) {
		try {
			cwd = $await_9;
			return Promise.resolve(sander.writeFile(cwd, 'alpha.txt', 'alpha')).then(function ($await_10) {
				try {
					return Promise.resolve((0, _execa2.default)('git', ['add', 'alpha.txt'], { cwd })).then(function ($await_11) {
						try {
							return Promise.resolve((0, _execa2.default)('git', ['commit', '-m', 'alpha'], { cwd })).then(function ($await_12) {
								try {
									return Promise.resolve((0, _execa2.default)('git', ['rm', 'alpha.txt'], { cwd })).then(function ($await_13) {
										try {
											return Promise.resolve((0, _execa2.default)('git', ['commit', '-m', 'remove alpha'], { cwd })).then(function ($await_14) {
												try {
													expected = ['remove alpha\n\n', 'alpha\n\n'];
													return Promise.resolve((0, _2.default)({ cwd })).then(function ($await_15) {
														try {
															actual = $await_15;

															t.deepEqual(actual, expected);
															return $return();
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
		} catch ($boundEx) {
			return $error($boundEx);
		}
	}.bind(this), $error);
}.bind(this)));

(0, _ava2.default)('get edit commit message from git subdirectory', t => new Promise(function ($return, $error) {
	var cwd, expected, actual;
	return Promise.resolve(_test.git.bootstrap()).then(function ($await_16) {
		try {
			cwd = $await_16;
			return Promise.resolve(sander.mkdir(cwd, 'beta')).then(function ($await_17) {
				try {
					return Promise.resolve(sander.writeFile(cwd, 'beta/beta.txt', 'beta')).then(function ($await_18) {
						try {
							return Promise.resolve((0, _execa2.default)('git', ['add', '.'], { cwd })).then(function ($await_19) {
								try {
									return Promise.resolve((0, _execa2.default)('git', ['commit', '-m', 'beta'], { cwd })).then(function ($await_20) {
										try {
											expected = ['beta\n\n'];
											return Promise.resolve((0, _2.default)({ edit: true, cwd })).then(function ($await_21) {
												try {
													actual = $await_21;

													t.deepEqual(actual, expected);
													return $return();
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
}.bind(this)));
//# sourceMappingURL=index.test.js.map