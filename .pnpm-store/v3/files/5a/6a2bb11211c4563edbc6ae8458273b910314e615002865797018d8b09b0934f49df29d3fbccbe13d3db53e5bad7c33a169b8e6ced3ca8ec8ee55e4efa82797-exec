#!/usr/bin/env node

'use strict'

const meow = require(`meow`)
const conventionalRecommendedBump = require(`./`)
const path = require(`path`)

const cli = meow(`
    Usage
      conventional-recommended-bump

    Example
      conventional-recommended-bump

    Options
      -p, --preset                   Name of the preset you want to use
      -g, --config                   A filepath of your config script
      -h, --header-pattern           Regex to match header pattern
      -c, --header-correspondence    Comma separated parts used to define what capturing group of 'headerPattern' captures what
      -r, --reference-actions        Comma separated keywords that used to reference issues
      -i, --issue-prefixes           Comma separated prefixes of an issue
      -n, --note-keywords            Comma separated keywords for important notes
      -f, --field-pattern            Regex to match other fields
      -v, --verbose                  Verbose output
      -l, --lerna-package            Recommend a bump for a specific lerna package (:pkg-name@1.0.0)
      -t, --tag-prefix               Tag prefix to consider when reading the tags
      --commit-path                  Recommend a bump scoped to a specific directory
`, {
  flags: {
    'preset': {
      alias: `p`
    },
    'config': {
      alias: `g`
    },
    'header-pattern': {
      alias: `h`
    },
    'header-correspondence': {
      alias: `c`
    },
    'reference-actions': {
      alias: `r`
    },
    'issue-prefixes': {
      alias: `i`
    },
    'note-keywords': {
      alias: `n`
    },
    'field-pattern': {
      alias: `f`
    },
    'verbose': {
      alias: `v`
    },
    'lerna-package': {
      alias: `l`
    },
    'tag-prefix': {
      alias: `t`
    }
  }
})

const options = {
  path: cli.flags.commitPath,
  lernaPackage: cli.flags.lernaPackage,
  tagPrefix: cli.flags.tagPrefix
}
const flags = cli.flags
const preset = flags.preset
const config = flags.config

if (preset) {
  options.preset = preset
  delete flags.preset
} else if (config) {
  options.config = require(path.resolve(process.cwd(), config))
  delete flags.config
}

if (flags.verbose) {
  options.warn = console.warn.bind(console)
}

conventionalRecommendedBump(options, flags, function (err, data) {
  if (err) {
    console.error(err.toString())
    process.exit(1)
  }

  if (data.releaseType) {
    console.log(data.releaseType)
  }

  if (flags.verbose && data.reason) {
    console.log(`Reason: ${data.reason}`)
  }
})
