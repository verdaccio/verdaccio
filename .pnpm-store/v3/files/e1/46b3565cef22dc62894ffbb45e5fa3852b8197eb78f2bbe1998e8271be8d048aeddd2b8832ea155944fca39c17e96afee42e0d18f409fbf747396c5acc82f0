'use strict';
const gitconfig = require('gitconfiglocal');
const pify = require('pify');

module.exports = dir => {
	return pify(gitconfig)(dir || process.cwd()).then(config => {
		var url = config.remote && config.remote.origin && config.remote.origin.url;

		if (!url) {
			throw new Error('Couldn\'t find origin url');
		}

		return url;
	});
};
