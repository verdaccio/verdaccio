var plugin = require('../')
var assert = require('assert')
var stuff = {config:{self_path:__dirname+'/config'},logger:{}}

describe('acc', function() {
  before(function(cb) {
    require('fs').unlink(__dirname + '/test-htpasswd', function() {
      cb()
    })
  })

  it('should have plugin interface', function() {
    assert.equal(typeof plugin, 'function')
    var p = plugin({file: './test-htpasswd'}, stuff)
    assert.equal(typeof p.authenticate, 'function')
  }) 

  it('should not authenticate random user', function(cb) {
    var p = plugin({file: './test-htpasswd'}, stuff)
    p.authenticate('blah', 'blah', function(err, groups) {
      assert(!err)
      assert(!groups)
      cb()
    })
  }) 

  it('should add user', function(cb) {
    var p = plugin({file: './test-htpasswd'}, stuff)
    p.adduser('foo1', 'bar1', function(err, ok) {
      assert(!err)
      assert(ok)
      cb()
    })
  })

  describe('user', function() {
    var p = plugin({file: './test-htpasswd'}, stuff)
    before(function(cb) {
      p.adduser('foo', 'bar', function(err, ok) {
        assert(!err)
        assert(ok)
        cb()
      })
    })

    it('should authenticate user', function(cb) {
      p.authenticate('foo', 'bar', function(err, groups) {
        assert(!err)
        assert.deepEqual(groups, ['foo'])
        cb()
      })
    })

    it('should fail different pass', function(cb) {
      p.authenticate('foo', 'bar111', function(err, groups) {
        assert(!err)
        assert(!groups)
        cb()
      })
    })

    it('should fail adding it again', function(cb) {
      p.adduser('foo', 'bar111', function(err, ok) {
        assert(err)
        cb()
      })
    })

    it('still should not authenticate random user', function(cb) {
      p.authenticate('blah', 'wow', function(err, groups) {
        assert(!err)
        assert(!groups)
        cb()
      })
    }) 
  })

  describe('max_users', function() {
    var p = plugin({file: './test-htpasswd', max_users: 1}, stuff)
    before(function(cb) {
      p.adduser('foo', 'bar', function(err, ok) {
        cb()
      })
    })

    it('should not add more users', function(cb) {
      p.adduser('foozzz', 'bar', function(err) {
        assert(err)
        cb()
      })
    })
  })

  describe('zero htpasswd', function() {
    before(function(cb) {
      require('fs').unlink(__dirname + '/zero-htpasswd', function() {
        require('fs').writeFile(__dirname + '/zero-htpasswd', '', cb)
      })
    })

    it('should not authenticate', function(cb) {
      var p = plugin({file: './zero-htpasswd', max_users: 1}, stuff)
      p.authenticate('blah', 'wow', function(err, groups) {
        assert(!err)
        assert(!groups)
        cb()
      })
    })

    it('should not add user with max_users=0', function(cb) {
      var p = plugin({file: './zero-htpasswd', max_users: 0}, stuff)
      p.adduser('foo1', 'bar1', function(err, ok) {
        assert(err)
        cb()
      })
    })

    it('should add user', function(cb) {
      var p = plugin({file: './zero-htpasswd'}, stuff)
      p.adduser('foo1', 'bar1', function(err, ok) {
        assert(!err)
        assert(ok)

        p.authenticate('foo1', 'bar1', function(err, ok) {
          assert(!err)
          assert(ok)
          cb()
        })
      })
    })
  })
})

