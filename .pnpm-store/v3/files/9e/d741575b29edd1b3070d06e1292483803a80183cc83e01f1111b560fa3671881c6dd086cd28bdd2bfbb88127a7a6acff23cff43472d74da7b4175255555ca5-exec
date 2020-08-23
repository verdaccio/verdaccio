#!/usr/bin/env node
/* eslint-disable no-process-exit */
const debug = require('debug')('detect-secrets')
const pkg = require('../package.json')
const cli = require('../src/cli')

const PYTHON_PACKAGE_EXEC = 'detect-secrets-hook'
const DOCKER_EXEC = 'docker'
const DOCKER_IMAGE_NAME = 'lirantal/detect-secrets'

const pwd = process.cwd()
const executableStrategies = [
  {
    type: 'python',
    filePath: PYTHON_PACKAGE_EXEC
  },
  {
    type: 'docker',
    filePath: DOCKER_EXEC,
    prefixCommandArguments: [
      'run',
      '--rm',
      '--volume',
      `${pwd}:/usr/src/app`,
      `${DOCKER_IMAGE_NAME}`
    ]
  }
]

debug(`${pkg.name} ${pkg.version}`)
const {strategyExitCode, strategiesInvoked} = cli.start(executableStrategies)
if (strategiesInvoked) {
  process.exit(strategyExitCode)
} else {
  console.log(`${pkg.name} ${pkg.version}`)
  console.log('WARNING: could not execute tool to prevent you from committing secrets')
  console.log(
    'to remedy the situation and enable secrets detection in your commits, consider one of:'
  )
  console.log(
    '  1. follow instructions on https://github.com/Yelp/detect-secrets to install detect-secrets'
  )
  console.log('  2. install docker and this Node.js CLI will use it to execute an image')
  console.log('')
}
