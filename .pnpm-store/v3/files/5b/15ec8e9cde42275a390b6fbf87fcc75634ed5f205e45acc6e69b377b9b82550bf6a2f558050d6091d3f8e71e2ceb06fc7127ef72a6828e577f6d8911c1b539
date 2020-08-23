var fs = require('fs')
var codecov = require('../lib/codecov')
var offlineErrors = require('../lib/offline')

describe('Codecov', function() {
  beforeEach(function() {
    try {
      fs.unlinkSync('report.tmp')
    } catch (e) {}
  })

  afterAll(function() {
    try {
      fs.unlinkSync('report.tmp')
    } catch (e) {}
  })

  it('can get upload to v2', function(done) {
    var self = this
    codecov.sendToCodecovV2(
      'https://codecov.io',
      {
        token: 'f881216b-b5c0-4eb1-8f21-b51887d1d506',
        commit: 'c739768fcac68144a3a6d82305b9c4106934d31a',
        branch: 'master',
      },
      'testing node-' + codecov.version,
      function(body) {
        expect(body).toContain(
          'https://codecov.io/github/codecov/ci-repo/commit/c739768fcac68144a3a6d82305b9c4106934d31a'
        )
        done()
      },
      function(errCode, errMsg) {
        if (offlineErrors.indexOf(errCode) !== -1) {
          self.skip() // offline - we can not test upload
          return
        }
        throw new Error(errMsg)
      }
    )
  })

  it('can get upload to v3', function(done) {
    var self = this
    jest.setTimeout(10000) // give this test extra time to run (default is 2000ms)
    codecov.sendToCodecovV3(
      'https://codecov.io',
      {
        token: 'f881216b-b5c0-4eb1-8f21-b51887d1d506',
        commit: 'c739768fcac68144a3a6d82305b9c4106934d31a',
        branch: 'master',
      },
      'testing node-' + codecov.version,
      function(body) {
        expect(body).toContain(
          'https://codecov.io/github/codecov/ci-repo/commit/c739768fcac68144a3a6d82305b9c4106934d31a'
        )
        done()
      },
      function(errCode, errMsg) {
        if (offlineErrors.indexOf(errCode) !== -1) {
          self.skip() // offline - we can not test upload
          return
        }
        throw new Error(errMsg)
      }
    )
  })

  it("upload v2 doesn't throw runtime error", function(done) {
    expect(
      codecov.sendToCodecovV2.bind(
        null,
        'https://codecov.io',
        {
          token: 'f881216b-b5c0-4eb1-8f21-b51887d1d506',
          commit: 'c739768fcac68144a3a6d82305b9c4106934d31a',
          branch: 'master',
        },
        'testing node-' + codecov.version,
        function(body) {
          expect(body).toContain(
            'https://codecov.io/github/codecov/ci-repo/commit/c739768fcac68144a3a6d82305b9c4106934d31a'
          )
          done()
        },
        function(errCode, errMsg) {
          if (offlineErrors.indexOf(errCode) !== -1) {
            done()
          }
          throw new Error(errMsg)
        }
      )
    ).not.toThrow()
  })
})
