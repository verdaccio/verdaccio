'use strict'

const chalk = require('chalk')
const checkpoint = require('../checkpoint')
const conventionalRecommendedBump = require('conventional-recommended-bump')
const figures = require('figures')
const fs = require('fs')
const DotGitignore = require('dotgitignore')
const path = require('path')
const presetLoader = require('../preset-loader')
const runLifecycleScript = require('../run-lifecycle-script')
const semver = require('semver')
const writeFile = require('../write-file')
const { resolveUpdaterObjectFromArgument } = require('../updaters')
let configsToUpdate = {}

function Bump (args, version) {
  // reset the cache of updated config files each
  // time we perform the version bump step.
  configsToUpdate = {}

  if (args.skip.bump) return Promise.resolve()
  let newVersion = version
  return runLifecycleScript(args, 'prerelease')
    .then(runLifecycleScript.bind(this, args, 'prebump'))
    .then((stdout) => {
      if (stdout && stdout.trim().length) args.releaseAs = stdout.trim()
      return bumpVersion(args.releaseAs, version, args)
    })
    .then((release) => {
      if (!args.firstRelease) {
        const releaseType = getReleaseType(args.prerelease, release.releaseType, version)
        newVersion = semver.valid(releaseType) || semver.inc(version, releaseType, args.prerelease)
        updateConfigs(args, newVersion)
      } else {
        checkpoint(args, 'skip version bump on first release', [], chalk.red(figures.cross))
      }
    })
    .then(() => {
      return runLifecycleScript(args, 'postbump')
    })
    .then(() => {
      return newVersion
    })
}

Bump.getUpdatedConfigs = function () {
  return configsToUpdate
}

function getReleaseType (prerelease, expectedReleaseType, currentVersion) {
  if (isString(prerelease)) {
    if (isInPrerelease(currentVersion)) {
      if (shouldContinuePrerelease(currentVersion, expectedReleaseType) ||
        getTypePriority(getCurrentActiveType(currentVersion)) > getTypePriority(expectedReleaseType)
      ) {
        return 'prerelease'
      }
    }

    return 'pre' + expectedReleaseType
  } else {
    return expectedReleaseType
  }
}

function isString (val) {
  return typeof val === 'string'
}

/**
 * if a version is currently in pre-release state,
 * and if it current in-pre-release type is same as expect type,
 * it should continue the pre-release with the same type
 *
 * @param version
 * @param expectType
 * @return {boolean}
 */
function shouldContinuePrerelease (version, expectType) {
  return getCurrentActiveType(version) === expectType
}

function isInPrerelease (version) {
  return Array.isArray(semver.prerelease(version))
}

const TypeList = ['major', 'minor', 'patch'].reverse()

/**
 * extract the in-pre-release type in target version
 *
 * @param version
 * @return {string}
 */
function getCurrentActiveType (version) {
  const typelist = TypeList
  for (let i = 0; i < typelist.length; i++) {
    if (semver[typelist[i]](version)) {
      return typelist[i]
    }
  }
}

/**
 * calculate the priority of release type,
 * major - 2, minor - 1, patch - 0
 *
 * @param type
 * @return {number}
 */
function getTypePriority (type) {
  return TypeList.indexOf(type)
}

function bumpVersion (releaseAs, currentVersion, args) {
  return new Promise((resolve, reject) => {
    if (releaseAs) {
      return resolve({
        releaseType: releaseAs
      })
    } else {
      const presetOptions = presetLoader(args)
      if (typeof presetOptions === 'object') {
        if (semver.lt(currentVersion, '1.0.0')) presetOptions.preMajor = true
      }
      conventionalRecommendedBump({
        debug: args.verbose && console.info.bind(console, 'conventional-recommended-bump'),
        preset: presetOptions,
        path: args.path,
        tagPrefix: args.tagPrefix
      }, function (err, release) {
        if (err) return reject(err)
        else return resolve(release)
      })
    }
  })
}

/**
 * attempt to update the version number in provided `bumpFiles`
 * @param args config object
 * @param newVersion version number to update to.
 * @return void
 */
function updateConfigs (args, newVersion) {
  const dotgit = DotGitignore()
  args.bumpFiles.forEach(function (bumpFile) {
    const updater = resolveUpdaterObjectFromArgument(bumpFile)
    if (!updater) {
      return
    }
    const configPath = path.resolve(process.cwd(), updater.filename)
    try {
      if (dotgit.ignore(configPath)) return
      const stat = fs.lstatSync(configPath)

      if (!stat.isFile()) return
      const contents = fs.readFileSync(configPath, 'utf8')
      checkpoint(
        args,
        'bumping version in ' + updater.filename + ' from %s to %s',
        [updater.updater.readVersion(contents), newVersion]
      )
      writeFile(
        args,
        configPath,
        updater.updater.writeVersion(contents, newVersion)
      )
      // flag any config files that we modify the version # for
      // as having been updated.
      configsToUpdate[updater.filename] = true
    } catch (err) {
      if (err.code !== 'ENOENT') console.warn(err.message)
    }
  })
}

module.exports = Bump
