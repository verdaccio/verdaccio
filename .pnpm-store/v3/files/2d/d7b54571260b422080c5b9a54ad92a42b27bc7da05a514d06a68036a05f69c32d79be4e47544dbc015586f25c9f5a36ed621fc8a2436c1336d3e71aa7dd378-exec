#!/usr/bin/env node
'use strict'

const debug = require('debug')('lockfile-lint')
const main = require('../src/main')
const cli = require('../src/cli')
debug(`parsed the following CLI arguments: ${JSON.stringify(cli)}`)

let validators = []
const supportedValidators = new Map([
  ['allowed-hosts', 'validateHosts'],
  ['validate-https', 'validateHttps'],
  ['allowed-schemes', 'validateSchemes']
])

for (const [commandArgument, commandValue] of Object.entries(cli)) {
  if (supportedValidators.has(commandArgument)) {
    const validatorItem = supportedValidators.get(commandArgument)
    validators.push({
      name: validatorItem,
      options: commandValue
    })
  }
}

let result
try {
  result = main.runValidators({
    path: cli['path'],
    type: cli['type'],
    validators
  })
} catch (error) {
  console.error('ABORTING lockfile lint process due to error exceptions', '\n')
  console.error(error.message, '\n')
  console.error(error.stack, '\n')
  console.error('error: command failed with exit code 1', '\n')
  process.exit(1)
}

const {validatorCount, validatorFailures, validatorSuccesses} = result

debug(`total validators invoked: ${validatorCount}`)
debug(`total validator failures: ${validatorFailures}`)
debug(`total validator successes: ${validatorSuccesses}`)

if (validatorFailures !== 0) {
  console.error('error: command failed with exit code 1', '\n')
  process.exit(1)
}
