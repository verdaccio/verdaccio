#!/usr/bin/env node
'use strict'
var meow = require('meow')
var gitSemverTags = require('./')

var args = meow(`
  Usage
    git-semver-tags
  Options
    --cwd                  path to git repository to be searched
    --lerna                parse lerna style git tags
    --package <name>       when listing lerna style tags, filter by a package
    --tag-prefix <prefix>  prefix to remove from the tags during their processing`,
{
  booleanDefault: undefined,
  flags: {
    cwd: {
      type: 'string'
    },
    lerna: {
      type: 'boolean'
    },
    package: {
      type: 'string'
    },
    tagPrefix: {
      type: 'string'
    }
  }
})

gitSemverTags({
  lernaTags: args.flags.lerna,
  package: args.flags.package,
  tagPrefix: args.flags.tagPrefix
}, function (err, tags) {
  if (err) {
    console.error(err.toString())
    process.exit(1)
  }

  console.log(tags.join('\n'))
})
