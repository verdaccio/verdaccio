'use strict'

const {LOCKFILE_TYPES} = require('./constants')

const ERROR_MESSAGES = {
  NO_OPTIONS: () => 'Did not receive options for lockfile path or type',
  NO_PARSER_FOR_TYPE: type =>
    `Unable to find relevant lockfile parser for type "${type}", the currently available options are ${LOCKFILE_TYPES}.`,
  NO_PARSER_FOR_PATH: path =>
    `Unable to find relevant lockfile parser for "${path}", consider passing the --type option.`,
  READ_FAILED: path => `Unable to read lockfile "${path}"`,
  PARSE_NPMLOCKFILE_FAILED: path => `Unable to parse npm lockfile "${path}"`,
  PARSE_YARNLOCKFILE_FAILED: path => `Unable to parse yarn lockfile "${path}"`
}

class ParsingError extends Error {
  /**
   * constructor
   * @param {string} errorKey - the key corresponding to the error message
   * @param {string} relatedValue - the value related to the error, to be used in the error message
   * @param {Error} error - the original error (if one exists)
   */
  constructor (errorFn, relatedValue = '', error = {}) {
    super()
    this.name = 'ParsingError'
    this.message = typeof errorFn === 'function' ? errorFn(relatedValue) : 'INVALID ERROR KEY'
    this.stack = error.stack || new Error().stack
  }
}

module.exports = {
  ParsingError,
  ERROR_MESSAGES
}
