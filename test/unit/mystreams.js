var ReadTarball = require('../../lib/streams').ReadTarballStream

describe('mystreams', function() {
  it('should delay events', function(cb) {
    var test = new ReadTarball()
    test.abort()
    setTimeout(function() {
      test.abort = function() {
        cb()
      }
      test.abort = function() {
        throw Error('fail')
      }
    }, 10)
  })
})

