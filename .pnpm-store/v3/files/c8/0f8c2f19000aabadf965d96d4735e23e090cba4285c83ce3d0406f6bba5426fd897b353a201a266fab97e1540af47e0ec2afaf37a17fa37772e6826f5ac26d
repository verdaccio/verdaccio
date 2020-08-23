'use strict'

const chunk = require('lodash/chunk')
const dedent = require('dedent')
const isWindows = require('is-windows')
const execa = require('execa')
const chalk = require('chalk')
const symbols = require('log-symbols')
const pMap = require('p-map')
const calcChunkSize = require('./calcChunkSize')
const findBin = require('./findBin')

const debug = require('debug')('lint-staged:task')

/**
 * Execute the given linter binary with arguments and file paths using execa and
 * return the promise.
 *
 * @param {string} bin
 * @param {Array<string>} args
 * @param {Object} execaOptions
 * @param {Array<string>} pathsToLint
 * @return {Promise} child_process
 */
function execLinter(bin, args, execaOptions, pathsToLint) {
  const binArgs = args.concat(pathsToLint)

  debug('bin:', bin)
  debug('args: %O', binArgs)
  debug('opts: %o', execaOptions)

  return execa(bin, binArgs, { ...execaOptions })
}

const successMsg = linter => `${symbols.success} ${linter} passed!`

/**
 * Create and returns an error instance with a given message.
 * If we set the message on the error instance, it gets logged multiple times(see #142).
 * So we set the actual error message in a private field and extract it later,
 * log only once.
 *
 * @param {string} message
 * @returns {Error}
 */
function throwError(message) {
  const err = new Error()
  err.privateMsg = `\n\n\n${message}`
  return err
}

/**
 * Create a failure message dependding on process result.
 *
 * @param {string} linter
 * @param {Object} result
 * @param {string} result.stdout
 * @param {string} result.stderr
 * @param {boolean} result.failed
 * @param {boolean} result.killed
 * @param {string} result.signal
 * @param {Object} context (see https://github.com/SamVerschueren/listr#context)
 * @returns {Error}
 */
function makeErr(linter, result, context = {}) {
  // Indicate that some linter will fail so we don't update the index with formatting changes
  context.hasErrors = true // eslint-disable-line no-param-reassign
  const { stdout, stderr, killed, signal } = result
  if (killed || (signal && signal !== '')) {
    return throwError(
      `${symbols.warning} ${chalk.yellow(`${linter} was terminated with ${signal}`)}`
    )
  }
  return throwError(dedent`${symbols.error} ${chalk.redBright(
    `${linter} found some errors. Please fix them and try committing again.`
  )}
  ${stdout}
  ${stderr}
  `)
}

/**
 * Returns the task function for the linter. It handles chunking for file paths
 * if the OS is Windows.
 *
 * @param {Object} options
 * @param {string} options.linter
 * @param {string} options.gitDir
 * @param {Array<string>} options.pathsToLint
 * @param {number} options.chunkSize
 * @param {number} options.subTaskConcurrency
 * @returns {function(): Promise<string>}
 */
module.exports = function resolveTaskFn(options) {
  const { linter, gitDir, pathsToLint } = options
  const { bin, args } = findBin(linter)

  const execaOptions = { reject: false }
  // Only use gitDir as CWD if we are using the git binary
  // e.g `npm` should run tasks in the actual CWD
  if (/git(\.exe)?$/i.test(bin) && gitDir !== process.cwd()) {
    execaOptions.cwd = gitDir
  }

  if (!isWindows()) {
    debug('%s  OS: %s; File path chunking unnecessary', symbols.success, process.platform)
    return ctx =>
      execLinter(bin, args, execaOptions, pathsToLint).then(result => {
        if (result.failed || result.killed || result.signal != null) {
          throw makeErr(linter, result, ctx)
        }

        return successMsg(linter)
      })
  }

  const { chunkSize, subTaskConcurrency: concurrency } = options

  const filePathChunks = chunk(pathsToLint, calcChunkSize(pathsToLint, chunkSize))
  const mapper = execLinter.bind(null, bin, args, execaOptions)

  debug(
    'OS: %s; Creating linter task with %d chunked file paths',
    process.platform,
    filePathChunks.length
  )
  return ctx =>
    pMap(filePathChunks, mapper, { concurrency })
      .catch(err => {
        /* This will probably never be called. But just in case.. */
        throw new Error(dedent`
        ${symbols.error} ${linter} got an unexpected error.
        ${err.message}
      `)
      })
      .then(results => {
        const errors = results.filter(res => res.failed || res.killed)
        const failed = results.some(res => res.failed)
        const killed = results.some(res => res.killed)
        const signals = results.map(res => res.signal).filter(Boolean)

        if (failed || killed || signals.length > 0) {
          const finalResult = {
            stdout: errors.map(err => err.stdout).join(''),
            stderr: errors.map(err => err.stderr).join(''),
            failed,
            killed,
            signal: signals.join(', ')
          }

          throw makeErr(linter, finalResult, ctx)
        }

        return successMsg(linter)
      })
}
