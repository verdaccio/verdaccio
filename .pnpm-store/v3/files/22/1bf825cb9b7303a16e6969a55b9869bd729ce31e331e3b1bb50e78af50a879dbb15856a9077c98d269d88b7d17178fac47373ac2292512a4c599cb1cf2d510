'use strict'

// Promise polyfill for IE and others.
if (typeof Promise !== 'function') {
  global.Promise = require('pinkie')
}

var test = require('tape')
var uuid = require('uuid/v4')
var level = require('.')

require('level-packager/abstract/base-test')(test, level)
require('level-packager/abstract/db-values-test')(test, level)

function factory (opts) {
  return level(uuid(), opts)
}

test('level put', function (t) {
  t.plan(4)

  var db = factory()

  db.put('name', 'level', function (err) {
    t.ifError(err, 'no put error')

    db.get('name', function (err, value) {
      t.ifError(err, 'no get error')
      t.is(value, 'level')

      db.close(function (err) {
        t.ifError(err, 'no close error')
      })
    })
  })
})

test('level binary value', function (t) {
  t.plan(9)

  var db = factory({ valueEncoding: 'binary' })
  var buf = Buffer.from('00ff', 'hex')

  db.put('binary', buf, function (err) {
    t.ifError(err, 'no put error')

    db.get('binary', function (err, value) {
      t.ifError(err, 'no get error')
      t.ok(Buffer.isBuffer(value), 'is a buffer')
      t.same(value, buf)

      db.get('binary', { valueEncoding: 'id' }, function (err, value) {
        t.ifError(err, 'no get error')
        t.notOk(Buffer.isBuffer(value), 'is not a buffer')
        t.ok(value instanceof Uint8Array, 'is a Uint8Array')
        t.same(Buffer.from(value), buf)

        db.close(function (err) {
          t.ifError(err, 'no close error')
        })
      })
    })
  })
})
