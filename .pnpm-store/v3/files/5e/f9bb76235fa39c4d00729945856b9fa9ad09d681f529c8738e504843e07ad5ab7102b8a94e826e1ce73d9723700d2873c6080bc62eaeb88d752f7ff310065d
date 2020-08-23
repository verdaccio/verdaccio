'use strict';
var path = require('path');
var textExtensions = require('text-extensions');
var exts = Object.create(null);

textExtensions.forEach(function (el) {
	exts[el] = true;
});

module.exports = function (filepath) {
	return path.extname(filepath).slice(1).toLowerCase() in exts;
};
