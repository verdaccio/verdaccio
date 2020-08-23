'use strict'

const {ValidateHost, ParseLockfile, ValidateHttps, ValidateScheme} = require('lockfile-lint-api')
const debug = require('debug')

module.exports = {
  ValidateHostManager,
  ValidateHttpsManager,
  ValidateSchemeManager
}

function ValidateSchemeManager ({path, type, validatorOptions}) {
  debug('validate-scheme-manager')(
    `invoked with validator options: ${JSON.stringify(validatorOptions)}`
  )

  const options = {
    lockfilePath: path,
    lockfileType: type
  }

  const parser = new ParseLockfile(options)
  const lockfile = parser.parseSync()
  const validator = new ValidateScheme({packages: lockfile.object})

  return validator.validate(validatorOptions)
}

function ValidateHostManager ({path, type, validatorOptions}) {
  debug('validate-host-manager')(
    `invoked with validator options: ${JSON.stringify(validatorOptions)}`
  )

  const options = {
    lockfilePath: path,
    lockfileType: type
  }

  const parser = new ParseLockfile(options)
  const lockfile = parser.parseSync()
  const validator = new ValidateHost({packages: lockfile.object})

  return validator.validate(validatorOptions)
}

function ValidateHttpsManager ({path, type, validatorOptions}) {
  debug('validate-host-manager')(
    `invoked with validator options: ${JSON.stringify(validatorOptions)}`
  )

  const options = {
    lockfilePath: path,
    lockfileType: type
  }

  const parser = new ParseLockfile(options)
  const lockfile = parser.parseSync()
  const validator = new ValidateHttps({packages: lockfile.object})

  return validator.validate()
}
