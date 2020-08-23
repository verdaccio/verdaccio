'use strict'
const path = require('path')
const pathExists = require('path-exists')
const loadYamlFile = require('load-yaml-file')

module.exports = async function (pkgPath) {
  const modulesPath = path.join(pkgPath, 'node_modules')
  const exists = await pathExists(path.join(modulesPath, '.yarn-integrity'))
  if (exists) return { name: 'yarn' }

  try {
    const modules = await loadYamlFile(path.join(modulesPath, '.modules.yaml'))
    return toNameAndVersion(modules.packageManager)
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
  }

  const modulesExists = await pathExists(modulesPath)
  return modulesExists ? { name: 'npm' } : null
}

function toNameAndVersion (pkgSpec) {
  if (pkgSpec[0] === '@') {
    const woPrefix = pkgSpec.substr(1)
    const parts = woPrefix.split('@')
    return {
      name: `@${parts[0]}`,
      version: parts[1]
    }
  }
  const parts = pkgSpec.split('@')
  return {
    name: parts[0],
    version: parts[1]
  }
}
