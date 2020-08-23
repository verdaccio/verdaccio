'use strict'
const betterPathResolve = require('better-path-resolve')
const path = require('path')

module.exports = function isSubdir (parentDir, subdir) {
  const rParent = `${betterPathResolve(parentDir)}${path.sep}`
  const rDir = `${betterPathResolve(subdir)}${path.sep}`
  return rDir.startsWith(rParent)
}
