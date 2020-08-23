/* eslint-disable security/detect-child-process */
/* eslint-disable no-process-exit */
'use strict'

const ChildProcess = require('child_process')
const debug = require('debug')('detect-secrets')
const which = require('which')

function isExecutableAvailableInPath(executable) {
  debug(`checking if the executable ${executable} exists`)
  let resolved
  try {
    resolved = which.sync(executable)
    debug(`found executable ${executable} at: ${resolved}`)
  } catch (error) {
    debug(error)
  }

  if (!resolved) {
    return false
  }

  return true
}

function executeStrategy(strategy) {
  let hookCommandArguments = process.argv.slice(2)
  debug(
    `received ${hookCommandArguments.length} command arguments: ${JSON.stringify(
      hookCommandArguments
    )}`
  )

  if (strategy.prefixCommandArguments && strategy.prefixCommandArguments.length > 0) {
    hookCommandArguments = strategy.prefixCommandArguments.concat(hookCommandArguments)
  }

  debug(`executing [${strategy.filePath}] with command arguments:`)
  debug(hookCommandArguments)

  const spawnResult = ChildProcess.spawnSync(strategy.filePath, hookCommandArguments, {
    shell: true
  })

  debug(`exited with code: ${spawnResult.status}`)
  console.log(spawnResult.stdout.toString('utf-8'))
  console.error(spawnResult.stderr.toString('utf-8'))

  const stderr = spawnResult.stderr.toString('utf-8')
  const stringFound = stderr.match(/The baseline file was updated/g)
  if (stringFound) {
    // force a 0 status code as this isn't an actual error
    // ref: https://github.com/Yelp/detect-secrets/issues/212
    return 0
  }

  return spawnResult.status
}

module.exports = {
  isExecutableAvailableInPath,
  executeStrategy
}
