'use strict'
const concat = require(`concat-stream`)
const conventionalCommitsFilter = require(`conventional-commits-filter`)
const conventionalCommitsParser = require(`conventional-commits-parser`)
const conventionalChangelogPresetLoader = require(`conventional-changelog-preset-loader`)
const gitSemverTags = require(`git-semver-tags`)
const gitRawCommits = require(`git-raw-commits`)
const presetResolver = require(`./preset-resolver`)

const VERSIONS = [`major`, `minor`, `patch`]

module.exports = conventionalRecommendedBump

function conventionalRecommendedBump (optionsArgument, parserOptsArgument, cbArgument) {
  if (typeof optionsArgument !== `object`) {
    throw new Error(`The 'options' argument must be an object.`)
  }

  const options = Object.assign({ ignoreReverted: true }, optionsArgument)

  const cb = typeof parserOptsArgument === `function` ? parserOptsArgument : cbArgument

  if (typeof cb !== `function`) {
    throw new Error(`You must provide a callback function.`)
  }

  let presetPackage = options.config || {}
  if (options.preset) {
    try {
      presetPackage = conventionalChangelogPresetLoader(options.preset)
    } catch (err) {
      if (err.message === 'does not exist') {
        const preset = typeof options.preset === 'object' ? options.preset.name : options.preset
        return cb(new Error(`Unable to load the "${preset}" preset package. Please make sure it's installed.`))
      } else {
        return cb(err)
      }
    }
  }

  presetResolver(presetPackage).then(config => {
    const whatBump = options.whatBump ||
      ((config.recommendedBumpOpts && config.recommendedBumpOpts.whatBump)
        ? config.recommendedBumpOpts.whatBump
        : noop)

    if (typeof whatBump !== `function`) {
      throw Error(`whatBump must be a function`)
    }

    // TODO: For now we defer to `config.recommendedBumpOpts.parserOpts` if it exists, as our initial refactor
    // efforts created a `parserOpts` object under the `recommendedBumpOpts` object in each preset package.
    // In the future we want to merge differences found in `recommendedBumpOpts.parserOpts` into the top-level
    // `parserOpts` object and remove `recommendedBumpOpts.parserOpts` from each preset package if it exists.
    const parserOpts = Object.assign({},
      config.recommendedBumpOpts && config.recommendedBumpOpts.parserOpts
        ? config.recommendedBumpOpts.parserOpts
        : config.parserOpts,
      parserOptsArgument)

    const warn = typeof parserOpts.warn === `function` ? parserOpts.warn : noop

    gitSemverTags({
      lernaTags: !!options.lernaPackage,
      package: options.lernaPackage,
      tagPrefix: options.tagPrefix
    }, (err, tags) => {
      if (err) {
        return cb(err)
      }

      gitRawCommits({
        format: `%B%n-hash-%n%H`,
        from: tags[0] || ``,
        path: options.path
      })
        .pipe(conventionalCommitsParser(parserOpts))
        .pipe(concat(data => {
          const commits = options.ignoreReverted ? conventionalCommitsFilter(data) : data

          if (!commits || !commits.length) {
            warn(`No commits since last release`)
          }

          let result = whatBump(commits, options)

          if (result && result.level != null) {
            result.releaseType = VERSIONS[result.level]
          } else if (result == null) {
            result = {}
          }

          cb(null, result)
        }))
    })
  }).catch(err => cb(err))
}

function noop () {}
