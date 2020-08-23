/* global describe,it */

const dotgit = require('./')()

require('chai').should()

describe('dotgitignore', () => {
  describe('ignore', () => {
    it('should return true for ignored files', () => {
      dotgit.ignore('.DS_Store').should.equal(true)
    })

    it('should return false for files that are not ignored', () => {
      dotgit.ignore('README.md').should.equal(false)
    })

    it('should return false for comments', () => {
      dotgit.ignore('package.json').should.equal(false)
    })

    it('should return false for matched negated lines', () => {
      dotgit.ignore('lib').should.equal(false)
    })
  })
})
