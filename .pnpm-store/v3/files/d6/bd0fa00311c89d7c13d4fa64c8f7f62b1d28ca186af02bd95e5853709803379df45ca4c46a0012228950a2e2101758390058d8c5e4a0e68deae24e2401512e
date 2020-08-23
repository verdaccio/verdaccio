/* eslint-disable security/detect-child-process */
/* eslint-disable no-process-exit */
'use strict'

const {isExecutableAvailableInPath, executeStrategy} = require('../src/strategies')

function start(executableStrategies) {
  let strategyExitCode = 0
  let strategiesInvoked = false
  executableStrategies.forEach(strategy => {
    const strategyExists = isExecutableAvailableInPath(strategy.filePath)
    if (strategyExists && !strategiesInvoked) {
      strategiesInvoked = true
      strategyExitCode = executeStrategy(strategy)
    }
  })

  return {
    strategyExitCode,
    strategiesInvoked
  }
}

module.exports = {
  start
}
