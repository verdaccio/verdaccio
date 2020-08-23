'use strict'

var dargs = require('dargs')
var execFile = require('child_process').execFile
var split = require('split2')
var stream = require('stream')
var template = require('lodash.template')
var through = require('through2')

var DELIMITER = '------------------------ >8 ------------------------'

function normalizeExecOpts (execOpts) {
  execOpts = execOpts || {}
  execOpts.cwd = execOpts.cwd || process.cwd()
  return execOpts
}

function normalizeGitOpts (gitOpts) {
  gitOpts = gitOpts || {}
  gitOpts.format = gitOpts.format || '%B'
  gitOpts.from = gitOpts.from || ''
  gitOpts.to = gitOpts.to || 'HEAD'
  return gitOpts
}

function getGitArgs (gitOpts) {
  var gitFormat = template('--format=<%= format %>%n' + DELIMITER)(gitOpts)
  var gitFromTo = [gitOpts.from, gitOpts.to].filter(Boolean).join('..')

  var gitArgs = ['log', gitFormat, gitFromTo]

  // allow commits to focus on a single directory
  // this is useful for monorepos.
  if (gitOpts.path) {
    gitArgs.push('--', gitOpts.path)
  }

  return gitArgs.concat(dargs(gitOpts, {
    excludes: ['debug', 'from', 'to', 'format', 'path']
  }))
}

function gitRawCommits (rawGitOpts, rawExecOpts) {
  var readable = new stream.Readable()
  readable._read = function () {}

  var gitOpts = normalizeGitOpts(rawGitOpts)
  var execOpts = normalizeExecOpts(rawExecOpts)
  var args = getGitArgs(gitOpts)

  if (gitOpts.debug) {
    gitOpts.debug('Your git-log command is:\ngit ' + args.join(' '))
  }

  var isError = false

  var child = execFile('git', args, {
    cwd: execOpts.cwd,
    maxBuffer: Infinity
  })

  child.stdout
    .pipe(split(DELIMITER + '\n'))
    .pipe(through(function (chunk, enc, cb) {
      readable.push(chunk)
      isError = false

      cb()
    }, function (cb) {
      setImmediate(function () {
        if (!isError) {
          readable.push(null)
          readable.emit('close')
        }

        cb()
      })
    }))

  child.stderr
    .pipe(through.obj(function (chunk) {
      isError = true
      readable.emit('error', new Error(chunk))
      readable.emit('close')
    }))

  return readable
}

module.exports = gitRawCommits
