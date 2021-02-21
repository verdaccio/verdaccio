const path = require('path');

exports.staticPath = path.join(__dirname, 'static');
exports.manifest = require('./static/manifest.json');
exports.manifestFiles = {
  js: ['runtime.js', 'vendors.js', 'main.js'],
  css: ['main.css'],
  ico: 'ico.co',
};
