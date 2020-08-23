'use strict'

const addBangNotes = require('./add-bang-notes')
const parserOpts = require(`./parser-opts`)

module.exports = function (config) {
  return {
    parserOpts: parserOpts(config),

    whatBump: (commits) => {
      let level = 2
      let breakings = 0
      let features = 0

      commits.forEach(commit => {
        // adds additional breaking change notes
        // for the special case, test(system)!: hello world, where there is
        // a '!' but no 'BREAKING CHANGE' in body:
        addBangNotes(commit)
        if (commit.notes.length > 0) {
          breakings += commit.notes.length
          level = 0
        } else if (commit.type === `feat`) {
          features += 1
          if (level === 2) {
            level = 1
          }
        }
      })

      if (config.preMajor && level < 2) {
        level++
      }

      return {
        level: level,
        reason: breakings === 1
          ? `There is ${breakings} BREAKING CHANGE and ${features} features`
          : `There are ${breakings} BREAKING CHANGES and ${features} features`
      }
    }
  }
}
