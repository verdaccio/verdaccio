var assert = require('assert')
  , parse_htpasswd = require('../utils').parse_htpasswd
  , verify_password = require('../utils').verify_password
  , add_user_to_htpasswd = require('../utils').add_user_to_htpasswd

describe('parse_htpasswd', function() {
  // TODO
})

describe('verify_password', function() {
  it('should verify plain', function() {
    assert(verify_password('user', 'pass', '{PLAIN}pass'))
    assert(!verify_password('user', 'p', '{PLAIN}pass'))
  })
  it('should verify sha', function() {
    assert(verify_password('user', 'pass', '{SHA}nU4eI71bcnBGqeO0t9tXvY1u5oQ='))
    assert(!verify_password('user', 'p', '{SHA}nU4eI71bcnBGqeO0t9tXvY1u5oQ='))
  })
  it('should verify crypt', function() {
    assert(verify_password('user', 'pass', 'ulINxGnqObi36'))
    assert(!verify_password('user', 'p', 'ulINxGnqObi36'))
  })
  it('should verify crypt-sha', function() {
    assert(verify_password('user', 'pass', '$6$Qx0eNSKPbxocgA==$ugjO0.z9yOFiaJXJK4ulvGYIxF/KZBV4lGqasArYPqPPT4orZ6NlnIE5KhtiOVs.5EoWxLg1sjp318G8RpI2x1'))
    assert(!verify_password('user', 'p', '$6$Qx0eNSKPbxocgA==$ugjO0.z9yOFiaJXJK4ulvGYIxF/KZBV4lGqasArYPqPPT4orZ6NlnIE5KhtiOVs.5EoWxLg1sjp318G8RpI2x1'))
  })
})

describe('add_user_to_htpasswd', function() {
  it('should add user to empty file', function() {
    var res = add_user_to_htpasswd('', 'user', 'passwd')
    assert(res.match(/^user:[^:\n]+:autocreated [^\n]+\n$/))
  })

  it('should append user / newline checks', function() {
    var res = add_user_to_htpasswd('testtest', 'user', 'passwd')
    assert(res.match(/^testtest\nuser:[^:\n]+:autocreated [^\n]+\n$/))
    var res = add_user_to_htpasswd('testtest\n', 'user', 'passwd')
    assert(res.match(/^testtest\nuser:[^:\n]+:autocreated [^\n]+\n$/))
    var res = add_user_to_htpasswd('testtest\n\n', 'user', 'passwd')
    assert(res.match(/^testtest\n\nuser:[^:\n]+:autocreated [^\n]+\n$/))
  })

  it('should not append invalid users', function() {
    assert.throws(function() {
      add_user_to_htpasswd('', 'us:er', 'passwd')
    }, /non-uri-safe/)
    assert.throws(function() {
      add_user_to_htpasswd('', 'us\ner', 'passwd')
    }, /non-uri-safe/)
    assert.throws(function() {
      add_user_to_htpasswd('', 'us#er', 'passwd')
    }, /non-uri-safe/)
  })
})

