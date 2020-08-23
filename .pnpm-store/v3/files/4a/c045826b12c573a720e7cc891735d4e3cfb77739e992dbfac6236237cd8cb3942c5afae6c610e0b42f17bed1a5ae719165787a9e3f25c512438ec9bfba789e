/* eslint-disable security/detect-object-injection */
'use strict'

const fs = require('fs')
const path = require('path')
const yarnLockfileParser = require('@yarnpkg/lockfile')
const {ParsingError, ERROR_MESSAGES} = require('./common/ParsingError')
const {
  NO_OPTIONS,
  NO_PARSER_FOR_PATH,
  NO_PARSER_FOR_TYPE,
  READ_FAILED,
  PARSE_NPMLOCKFILE_FAILED,
  PARSE_YARNLOCKFILE_FAILED
} = ERROR_MESSAGES

class ParseLockfile {
  /**
   * constructor
   * @param {string} options.lockfilePath - path to the lockfile
   * @param {string} options.lockfileType - the package manager type
   * for lockfile
   */
  constructor (options) {
    if (!options || typeof options !== 'object') {
      throw new ParsingError(NO_OPTIONS)
    }

    this.options = {}
    this.options.lockfilePath = options.lockfilePath
    this.options.lockfileType = options.lockfileType
  }

  /**
   * Checks if lockfile type option was provided
   * @return boolean
   */
  isLockfileTypeGiven () {
    return typeof this.options.lockfileType === 'string' && this.options.lockfileType
  }

  /**
   * Synchronously parses a lockfile
   * @return {object} parsed file
   */
  parseSync () {
    const lockfileParser = this.resolvePkgMgrForLockfile()
    if (!lockfileParser) {
      if (this.isLockfileTypeGiven()) {
        throw new ParsingError(NO_PARSER_FOR_TYPE, this.options.lockfileType)
      }
      throw new ParsingError(NO_PARSER_FOR_PATH, this.options.lockfilePath)
    }

    let file
    try {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      file = fs.readFileSync(this.options.lockfilePath, 'utf8')
    } catch (error) {
      throw new ParsingError(READ_FAILED, this.options.lockfilePath, error)
    }

    return lockfileParser.call(this, file)
  }

  resolvePkgMgrForLockfile () {
    const lockfileResolversByPackageManager = {
      npm: this.parseNpmLockfile,
      npmjs: this.parseNpmLockfile,
      yarn: this.parseYarnLockfile,
      yarnpkg: this.parseYarnLockfile
    }

    let resolver
    if (this.isLockfileTypeGiven()) {
      resolver = lockfileResolversByPackageManager[this.options.lockfileType]
    }

    if (!resolver) {
      resolver = this.resolvePkgMgrByFilename()
    }

    return resolver
  }

  resolvePkgMgrByFilename () {
    const lockfileResolverByFilename = {
      'package-lock.json': this.parseNpmLockfile,
      'yarn.lock': this.parseYarnLockfile
    }

    const pathInfo = path.parse(this.options.lockfilePath)
    const baseFilename = pathInfo.base

    return lockfileResolverByFilename[baseFilename]
  }

  parseYarnLockfile (lockfileBuffer) {
    let parsedFile
    try {
      parsedFile = yarnLockfileParser.parse(lockfileBuffer)
    } catch (error) {
      throw new ParsingError(PARSE_YARNLOCKFILE_FAILED, this.options.lockfilePath, error)
    }
    return parsedFile
  }

  parseNpmLockfile (lockfileBuffer) {
    let flattenedDepTree
    try {
      const packageJsonParsed = JSON.parse(lockfileBuffer)

      // transform original format of npm's package-json to match yarns
      // so we have a unified format to validate against
      const npmDepsTree = packageJsonParsed.dependencies
      flattenedDepTree = this._flattenNpmDepsTree(npmDepsTree)
    } catch (error) {
      throw new ParsingError(PARSE_NPMLOCKFILE_FAILED, this.options.lockfilePath, error)
    }

    return {
      type: 'success',
      object: flattenedDepTree
    }
  }

  _flattenNpmDepsTree (npmDepsTree) {
    let flattenedDepTree = {}
    let flattenedNestedDepsTree = {}
    for (const [depName, depMetadata] of Object.entries(npmDepsTree)) {
      const depMetadataShortend = {
        version: depMetadata.version,
        resolved: depMetadata.resolved ? depMetadata.resolved : depMetadata.version,
        integrity: depMetadata.integrity,
        requires: depMetadata.requires
      }

      flattenedDepTree[`${depName}@${depMetadata.version}`] = depMetadataShortend

      const nestedDepsTree = depMetadata.dependencies
      if (nestedDepsTree && Object.keys(nestedDepsTree).length !== 0) {
        flattenedNestedDepsTree = this._flattenNpmDepsTree(nestedDepsTree)
      }
    }

    return Object.assign({}, flattenedDepTree, flattenedNestedDepsTree)
  }
}

module.exports = ParseLockfile
