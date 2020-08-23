const stringifyPackage = require('stringify-package')
const detectIndent = require('detect-indent')
const detectNewline = require('detect-newline')

module.exports.readVersion = function (contents) {
  return JSON.parse(contents).version
}

module.exports.writeVersion = function (contents, version) {
  const json = JSON.parse(contents)
  const indent = detectIndent(contents).indent
  const newline = detectNewline(contents)
  json.version = version
  return stringifyPackage(json, indent, newline)
}

module.exports.isPrivate = function (contents) {
  return JSON.parse(contents).private
}
