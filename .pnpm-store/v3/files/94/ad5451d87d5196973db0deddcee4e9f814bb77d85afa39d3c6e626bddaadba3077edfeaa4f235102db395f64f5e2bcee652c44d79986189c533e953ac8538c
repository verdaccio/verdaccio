'use strict'

var proc = require('process')
var exec = require('child_process').exec
var semverValid = require('semver').valid
var regex = /tag:\s*(.+?)[,)]/gi
var cmd = 'git log --decorate --no-color'

function lernaTag (tag, pkg) {
  if (pkg && !(new RegExp('^' + pkg + '@')).test(tag)) {
    return false
  } else {
    return /^.+@[0-9]+\.[0-9]+\.[0-9]+(-.+)?$/.test(tag)
  }
}

module.exports = function gitSemverTags (opts, callback) {
  if (typeof opts === 'function') {
    callback = opts
    opts = {}
  }
  var options = Object.assign({ maxBuffer: Infinity, cwd: proc.cwd() }, opts)

  if (options.package && !options.lernaTags) {
    callback(new Error('opts.package should only be used when running in lerna mode'))
    return
  }

  exec(cmd, options, function (err, data) {
    if (err) {
      callback(err)
      return
    }

    var tags = []
    var tagPrefixRegexp
    if (options.tagPrefix) {
      tagPrefixRegexp = new RegExp('^' + options.tagPrefix + '(.*)')
    }
    data.split('\n').forEach(function (decorations) {
      var match
      while ((match = regex.exec(decorations))) {
        var tag = match[1]
        if (options.lernaTags) {
          if (lernaTag(tag, options.package)) {
            tags.push(tag)
          }
        } else if (options.tagPrefix) {
          var matches = tag.match(tagPrefixRegexp)
          if (matches && semverValid(matches[1])) {
            tags.push(tag)
          }
        } else if (semverValid(tag)) {
          tags.push(tag)
        }
      }
    })

    callback(null, tags)
  })
}
