'use strict'

const debug = require('debug')('lint-staged:git')
const execa = require('execa')
const path = require('path')

function getAbsolutePath(dir) {
  return path.isAbsolute(dir) ? dir : path.resolve(dir)
}

module.exports = async function execGit(cmd, options = {}) {
  const cwd = options.cwd || process.cwd()
  debug('Running git command', cmd)
  try {
    const { stdout } = await execa('git', [].concat(cmd), {
      ...options,
      cwd: getAbsolutePath(cwd)
    })
    return stdout
  } catch (err) {
    throw new Error(err)
  }
}
