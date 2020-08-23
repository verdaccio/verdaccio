'use strict'
const bench = require('fastbench')
const noir = require('pino-noir')(['a.b.c'])
const fastRedact = require('..')
const redactNoSerialize = fastRedact({ paths: ['a.b.c'], serialize: false })
const redactWildNoSerialize = fastRedact({ paths: ['a.b.*'], serialize: false })
const redactIntermediateWildNoSerialize = fastRedact({ paths: ['a.*.c'], serialize: false })
const redact = fastRedact({ paths: ['a.b.c'] })
const noirWild = require('pino-noir')(['a.b.*'])
const redactWild = fastRedact({ paths: ['a.b.*'] })
const redactIntermediateWild = fastRedact({ paths: ['a.*.c'] })
const redactIntermediateWildMatchWildOutcome = fastRedact({ paths: ['a.*.c', 'a.*.b', 'a.*.a'] })
const redactStaticMatchWildOutcome = fastRedact({ paths: ['a.b.c', 'a.d.a', 'a.d.b', 'a.d.c'] })
const noirCensorFunction = require('pino-noir')(['a.b.*'], (v) => v + '.')
const redactCensorFunction = fastRedact({ paths: ['a.b.*'], censor: (v) => v + '.', serialize: false })

const obj = {
  a: {
    b: {
      c: 's'
    },
    d: {
      a: 's',
      b: 's',
      c: 's'
    }
  }
}

const max = 500

var run = bench([
  function benchNoirV2 (cb) {
    for (var i = 0; i < max; i++) {
      noir.a(obj.a)
    }
    setImmediate(cb)
  },
  function benchFastRedact (cb) {
    for (var i = 0; i < max; i++) {
      redactNoSerialize(obj)
    }
    setImmediate(cb)
  },
  function benchFastRedactRestore (cb) {
    for (var i = 0; i < max; i++) {
      redactNoSerialize(obj)
      redactNoSerialize.restore(obj)
    }
    setImmediate(cb)
  },
  function benchNoirV2Wild (cb) {
    for (var i = 0; i < max; i++) {
      noirWild.a(obj.a)
    }
    setImmediate(cb)
  },
  function benchFastRedactWild (cb) {
    for (var i = 0; i < max; i++) {
      redactWildNoSerialize(obj)
    }
    setImmediate(cb)
  },
  function benchFastRedactWildRestore (cb) {
    for (var i = 0; i < max; i++) {
      redactWildNoSerialize(obj)
      redactWildNoSerialize.restore(obj)
    }
    setImmediate(cb)
  },
  function benchFastRedactIntermediateWild (cb) {
    for (var i = 0; i < max; i++) {
      redactIntermediateWildNoSerialize(obj)
    }
    setImmediate(cb)
  },
  function benchFastRedactIntermediateWildRestore (cb) {
    for (var i = 0; i < max; i++) {
      redactIntermediateWildNoSerialize(obj)
      redactIntermediateWildNoSerialize.restore(obj)
    }
    setImmediate(cb)
  },
  function benchJSONStringify (cb) {
    for (var i = 0; i < max; i++) {
      JSON.stringify(obj)
    }
    setImmediate(cb)
  },
  function benchNoirV2Serialize (cb) {
    for (var i = 0; i < max; i++) {
      noir.a(obj.a)
      JSON.stringify(obj)
    }
    setImmediate(cb)
  },
  function benchFastRedactSerialize (cb) {
    for (var i = 0; i < max; i++) {
      redact(obj)
    }
    setImmediate(cb)
  },
  function benchNoirV2WildSerialize (cb) {
    for (var i = 0; i < max; i++) {
      noirWild.a(obj.a)
      JSON.stringify(obj)
    }
    setImmediate(cb)
  },
  function benchFastRedactWildSerialize (cb) {
    for (var i = 0; i < max; i++) {
      redactWild(obj)
    }
    setImmediate(cb)
  },
  function benchFastRedactIntermediateWildSerialize (cb) {
    for (var i = 0; i < max; i++) {
      redactIntermediateWild(obj)
    }
    setImmediate(cb)
  },
  function benchFastRedactIntermediateWildMatchWildOutcomeSerialize (cb) {
    for (var i = 0; i < max; i++) {
      redactIntermediateWildMatchWildOutcome(obj)
    }
    setImmediate(cb)
  },
  function benchFastRedactStaticMatchWildOutcomeSerialize (cb) {
    for (var i = 0; i < max; i++) {
      redactStaticMatchWildOutcome(obj)
    }
    setImmediate(cb)
  },
  function benchNoirV2CensorFunction (cb) {
    for (var i = 0; i < max; i++) {
      noirCensorFunction.a(obj.a)
    }
    setImmediate(cb)
  },
  function benchFastRedactCensorFunction (cb) {
    for (var i = 0; i < max; i++) {
      redactCensorFunction(obj)
    }
    setImmediate(cb)
  }
], 500)

run(run)
