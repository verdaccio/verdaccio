'use strict'

const {URL} = require('url')
const PackageError = require('../common/PackageError')
const {REGISTRY} = require('../common/constants')

module.exports = class ValidateHost {
  constructor ({packages} = {}) {
    if (typeof packages !== 'object') {
      throw new Error('expecting an object passed to validator constructor')
    }

    this.packages = packages
  }

  validate (hosts) {
    if (!Array.isArray(hosts)) {
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

      const allowedHosts = hosts.map(hostValue => {
        // eslint-disable-next-line security/detect-object-injection
        return REGISTRY[hostValue] ? REGISTRY[hostValue] : hostValue
      })

      if (allowedHosts.indexOf(packageResolvedURL.host) === -1) {
        // throw new Error(`detected invalid origin for package: ${packageName}`)
        validationResult.errors.push({
          message: `detected invalid host(s) for package: ${packageName}\n    expected: ${allowedHosts}\n    actual: ${
            packageResolvedURL.host
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
