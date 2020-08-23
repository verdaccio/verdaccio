'use strict'

module.exports = class PackageError extends Error {
  /**
   * constructor
   * @param {string} packageName - the name of the package where the error occured
   * @param {Error} error - the original error object
   */
  constructor (packageName = '', error = {}) {
    super()
    this.name = error.name || 'Error'
    this.message = `Encountered error ${error.message} in package: "${packageName}"`
    this.stack = error.stack
  }
}
