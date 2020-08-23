'use strict'

const path = require('path')
const micromatch = require('micromatch')
const pathIsInside = require('path-is-inside')
const { getConfig } = require('./getConfig')

const debug = require('debug')('lint-staged:gen-tasks')

module.exports = async function generateTasks(config, gitDir, stagedRelFiles) {
  debug('Generating linter tasks')

  const normalizedConfig = getConfig(config) // Ensure we have a normalized config
  const { linters, globOptions, ignore } = normalizedConfig

  const cwd = process.cwd()
  const stagedFiles = stagedRelFiles.map(file => path.resolve(gitDir, file))

  return Object.keys(linters).map(pattern => {
    const isParentDirPattern = pattern.startsWith('../')
    const commands = linters[pattern]

    const fileList = micromatch(
      stagedFiles
        // Only worry about children of the CWD unless the pattern explicitly
        // specifies that it concerns a parent directory.
        .filter(file => isParentDirPattern || pathIsInside(file, cwd))
        // Make the paths relative to CWD for filtering
        .map(file => path.relative(cwd, file)),
      pattern,
      {
        ...globOptions,
        ignore
      }
    ).map(file => {
      // if you set relative option, then the file path will be relative to your package.json
      if (config.relative) {
        return path.normalize(file)
      }
      // Return absolute path after the filter is run
      return path.resolve(cwd, file)
    })

    const task = { pattern, commands, fileList }
    debug('Generated task: \n%O', task)

    return task
  })
}
