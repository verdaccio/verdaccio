'use strict'

const {URL} = require('url')
const PackageError = require('../common/PackageError')

const HTTPS_PROTOCOL = 'https:'

module.exports = class ValidateHttps {
  constructor ({packages} = {}) {
    if (typeof packages !== 'object') {
      throw new Error('expecting an object passed to validator constructor')
    }

    this.packages = packages
  }

  validate () {
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

      if (packageResolvedURL.protocol !== HTTPS_PROTOCOL) {
        validationResult.errors.push({
          message: `detected invalid protocol for package: ${packageName}\n    expected: ${HTTPS_PROTOCOL}\n    actual: ${
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
