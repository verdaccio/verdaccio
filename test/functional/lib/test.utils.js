
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

exports.generateSha = function generateSha(key) {
  return crypto.createHash('sha1', 'binary').update(key).digest('hex');
};


exports.readFile = function readFile(filePath) {
  return fs.readFileSync(path.join(__dirname, `/${filePath}`));
}
