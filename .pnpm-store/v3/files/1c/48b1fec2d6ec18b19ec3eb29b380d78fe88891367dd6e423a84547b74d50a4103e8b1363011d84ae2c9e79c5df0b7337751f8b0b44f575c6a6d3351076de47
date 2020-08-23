'use strict';
const stripAnsi = require('strip-ansi');
const charRegex = require('char-regex');

const stringLength = string => {
	if (string === '') {
		return 0;
	}

	return stripAnsi(string).match(charRegex()).length;
};

module.exports = stringLength;
