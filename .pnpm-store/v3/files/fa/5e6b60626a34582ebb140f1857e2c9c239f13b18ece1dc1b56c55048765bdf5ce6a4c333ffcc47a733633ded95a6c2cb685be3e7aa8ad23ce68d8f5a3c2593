'use strict'

const {URL} = require('url')
const PackageError = require('../common/PackageError')

module.exports = class ValidateProtocol {
  constructor ({packages} = {}) {
    if (typeof packages !== 'object') {
      throw new Error('expecting an object passed to validator constructor')
    }

    this.packages = packages
  }

  validate (schemes) {
    if (!Array.isArray(schemes)) {
      throw new Error('validate method requires an array')
    }

    let validationResult = {
      type: 'success',
      errors: []
    }

    for (const [packageName, packageMetadata] of Object.entries(this.packages)) {
      let packageResolvedURL = {}
      try {
        packageResolvedURL = new URL(packageMetadata.resolved)
      } catch (error) {
        throw new PackageError(packageName, error)
      }
      if (schemes.indexOf(packageResolvedURL.protocol) === -1) {
        // throw new Error(`detected invalid origin for package: ${packageName}`)
        validationResult.errors.push({
          message: `detected invalid scheme(s) for package: ${packageName}\n    expected: ${schemes}\n    actual: ${
            packageResolvedURL.protocol
          }\n`,
          package: packageName
        })
      }
    }

    if (validationResult.errors.length !== 0) {
      validationResult.type = 'error'
    }

    return validationResult
  }
}
