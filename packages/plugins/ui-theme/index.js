const path = require('path');

exports.staticPath = path.join(__dirname, 'static');
exports.manifest = require('./static/manifest.json');
