'use strict'
const findYarnWorkspaceRoot = require('find-yarn-workspace-root2')
const findUp = require('find-up')
const path = require('path')
const pathExists = require('path-exists')
const whichPM = require('which-pm')

module.exports = async function preferredPM (pkgPath) {
  if (typeof pkgPath !== 'string') {
    throw new TypeError(`pkgPath should be a string, got ${typeof pkgPath}`)
  }
  if (await pathExists(path.join(pkgPath, 'package-lock.json'))) {
    return {
      name: 'npm',
      version: '>=5'
    }
  }
  if (await pathExists(path.join(pkgPath, 'yarn.lock'))) {
    return {
      name: 'yarn',
      version: '*'
    }
  }
  if (await pathExists(path.join(pkgPath, 'pnpm-lock.yaml'))) {
    return {
      name: 'pnpm',
      version: '>=3'
    }
  }
  if (await pathExists(path.join(pkgPath, 'shrinkwrap.yaml'))) {
    return {
      name: 'pnpm',
      version: '1 || 2'
    }
  }
  if (await findUp('pnpm-lock.yaml', { cwd: pkgPath })) {
    return {
      name: 'pnpm',
      version: '>=3'
    }
  }
  try {
    if (typeof findYarnWorkspaceRoot(pkgPath) === 'string') {
      return {
        name: 'yarn',
        version: '*'
      }
    }
  } catch (err) {}
  const pm = await whichPM(pkgPath)
  return pm && { name: pm.name, version: pm.version || '*' }
}
