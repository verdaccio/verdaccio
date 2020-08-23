'use strict'

const Q = require(`q`)
const readFile = Q.denodeify(require(`fs`).readFile)
const resolve = require(`path`).resolve

module.exports = Q.all([
  readFile(resolve(__dirname, `./templates/template.hbs`), `utf-8`),
  readFile(resolve(__dirname, `./templates/header.hbs`), `utf-8`),
  readFile(resolve(__dirname, `./templates/commit.hbs`), `utf-8`)
])
  .spread((template, header, commit) => {
    const writerOpts = getWriterOpts()

    writerOpts.mainTemplate = template
    writerOpts.headerPartial = header
    writerOpts.commitPartial = commit

    return writerOpts
  })

function getWriterOpts () {
  return {
    transform: (commit) => {
      if (!commit.component || typeof commit.component !== `string`) {
        return
      }

      if (typeof commit.hash === `string`) {
        commit.shortHash = commit.hash.substring(0, 7)
      }

      commit.references.forEach(function (reference) {
        if (reference.prefix === `#`) {
          reference.originalIssueTracker = `https://bugs.jquery.com/ticket/`
        }
      })

      return commit
    },
    groupBy: `component`,
    commitGroupsSort: `title`,
    commitsSort: [`component`, `shortDesc`]
  }
}
