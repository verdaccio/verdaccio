'use strict'

var isMatch = require('lodash.ismatch')
var modifyValues = require('modify-values')

function modifyValue (val) {
  if (typeof val === 'string') {
    return val.trim()
  }

  return val
}

function conventionalCommitsFilter (commits) {
  if (!Array.isArray(commits)) {
    throw new TypeError('Expected an array')
  }

  var ret = []
  var ignores = []
  var remove = []
  commits.forEach(function (commit) {
    if (commit.revert) {
      ignores.push(commit)
    }

    ret.push(commit)
  })

  // Filter out reverted commits
  ret = ret.filter(function (commit) {
    var ignoreThis = false

    commit = commit.raw ? modifyValues(commit.raw, modifyValue) : modifyValues(commit, modifyValue)

    ignores.some(function (ignoreCommit) {
      var ignore = modifyValues(ignoreCommit.revert, modifyValue)

      ignoreThis = isMatch(commit, ignore)

      if (ignoreThis) {
        remove.push(ignoreCommit.hash)
      }

      return ignoreThis
    })

    return !ignoreThis
  })

  // Filter out the commits that reverted something otherwise keep the revert commits
  ret = ret.filter(function (commit) {
    return remove.indexOf(commit.hash) !== 0
  })

  return ret
}

module.exports = conventionalCommitsFilter
