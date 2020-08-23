'use strict'

const debug = require('debug')('lockfile-lint')
const {
  ValidateHostManager,
  ValidateHttpsManager,
  ValidateSchemeManager
} = require('../src/validators')

const validatorFunctions = new Map([
  ['validateHosts', ValidateHostManager],
  ['validateHttps', ValidateHttpsManager],
  ['validateSchemes', ValidateSchemeManager]
])

function runValidators ({type, path, validators} = {}) {
  let validatorCount = 0
  let validatorFailures = 0
  let validatorSuccesses = 0

  if (!Array.isArray(validators)) {
    throw new Error('provided object must have a validators array list')
  }

  validators.forEach(validator => {
    const validatorFunction = validatorFunctions.get(validator.name)
    if (!validatorFunction) {
      return false
    }

    validatorCount++
    debug(`invoking validator for: ${validator.name}`)

    // eslint-disable-next-line security/detect-object-injection
    let validationResult = validatorFunction({
      path,
      type,
      validatorOptions: validator.options
    })

    if (validationResult.type === 'error') {
      validationResult.errors.forEach(validationError => {
        console.error(validationError.message)
        validatorFailures++
      })
    } else {
      debug(`validator ${validator.name} reported no issues`)
      validatorSuccesses++
    }
  })

  return {
    validatorCount,
    validatorFailures,
    validatorSuccesses
  }
}

module.exports = {
  runValidators
}
