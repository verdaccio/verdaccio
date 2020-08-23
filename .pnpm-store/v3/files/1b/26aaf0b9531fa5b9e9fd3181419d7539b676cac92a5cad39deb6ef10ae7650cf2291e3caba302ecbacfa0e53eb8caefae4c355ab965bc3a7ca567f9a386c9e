const gitSemverTags = require('git-semver-tags')
const semver = require('semver')

module.exports = function () {
  return new Promise((resolve, reject) => {
    gitSemverTags(function (err, tags) {
      if (err) return reject(err)
      else if (!tags.length) return resolve('1.0.0')
      // ensure that the largest semver tag is at the head.
      tags = tags.map(tag => { return semver.clean(tag) })
      tags.sort(semver.rcompare)
      return resolve(tags[0])
    })
  })
}
