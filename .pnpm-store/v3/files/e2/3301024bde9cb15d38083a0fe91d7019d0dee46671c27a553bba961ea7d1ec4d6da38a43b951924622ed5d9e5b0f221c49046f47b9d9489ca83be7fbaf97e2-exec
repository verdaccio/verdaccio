const bump = require('./lib/lifecycles/bump')
const changelog = require('./lib/lifecycles/changelog')
const commit = require('./lib/lifecycles/commit')
const fs = require('fs')
const latestSemverTag = require('./lib/latest-semver-tag')
const path = require('path')
const printError = require('./lib/print-error')
const tag = require('./lib/lifecycles/tag')
const { resolveUpdaterObjectFromArgument } = require('./lib/updaters')

module.exports = function standardVersion (argv) {
  const defaults = require('./defaults')
  /**
   * `--message` (`-m`) support will be removed in the next major version.
   */
  const message = argv.m || argv.message
  if (message) {
    /**
     * The `--message` flag uses `%s` for version substitutions, we swap this
     * for the substitution defined in the config-spec for future-proofing upstream
     * handling.
     */
    argv.releaseCommitMessageFormat = message.replace(/%s/g, '{{currentTag}}')
    if (!argv.silent) {
      console.warn('[standard-version]: --message (-m) will be removed in the next major release. Use --releaseCommitMessageFormat.')
    }
  }

  if (argv.changelogHeader) {
    argv.header = argv.changelogHeader
    if (!argv.silent) {
      console.warn('[standard-version]: --changelogHeader will be removed in the next major release. Use --header.')
    }
  }

  if (argv.header && argv.header.search(changelog.START_OF_LAST_RELEASE_PATTERN) !== -1) {
    throw Error(`custom changelog header must not match ${changelog.START_OF_LAST_RELEASE_PATTERN}`)
  }

  const args = Object.assign({}, defaults, argv)
  let pkg
  args.packageFiles.forEach((packageFile) => {
    if (pkg) return
    const updater = resolveUpdaterObjectFromArgument(packageFile)
    const pkgPath = path.resolve(process.cwd(), updater.filename)
    try {
      const contents = fs.readFileSync(pkgPath, 'utf8')
      pkg = {
        version: updater.updater.readVersion(contents),
        private: typeof updater.updater.isPrivate === 'function' ? updater.updater.isPrivate(contents) : false
      }
    } catch (err) {}
  })
  let newVersion
  return Promise.resolve()
    .then(() => {
      if (!pkg && args.gitTagFallback) {
        return latestSemverTag()
      } else if (!pkg) {
        throw new Error('no package file found')
      } else {
        return pkg.version
      }
    })
    .then(version => {
      newVersion = version
    })
    .then(() => {
      return bump(args, newVersion)
    })
    .then((_newVersion) => {
      // if bump runs, it calculaes the new version that we
      // should release at.
      if (_newVersion) newVersion = _newVersion
      return changelog(args, newVersion)
    })
    .then(() => {
      return commit(args, newVersion)
    })
    .then(() => {
      return tag(newVersion, pkg ? pkg.private : false, args)
    })
    .catch((err) => {
      printError(args, err.message)
      throw err
    })
}
