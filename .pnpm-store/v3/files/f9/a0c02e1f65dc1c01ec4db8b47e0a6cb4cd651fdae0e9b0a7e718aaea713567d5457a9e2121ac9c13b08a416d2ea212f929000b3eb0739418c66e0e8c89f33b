'use strict'

const { test } = require('tap')
const fastRedact = require('..')

const censor = '[REDACTED]'
const censorFct = value => !value ? value : 'xxx' + value.substr(-2)

test('returns no-op when passed no paths [serialize: false]', ({ end, doesNotThrow }) => {
  const redact = fastRedact({ paths: [], serialize: false })
  doesNotThrow(() => redact({}))
  doesNotThrow(() => {
    const o = redact({})
    redact.restore(o)
  })
  end()
})

test('returns serializer when passed no paths [serialize: default]', ({ end, is }) => {
  is(fastRedact({ paths: [] }), JSON.stringify)
  is(fastRedact(), JSON.stringify)
  end()
})

test('throws when passed non-object using defaults', ({ end, throws }) => {
  const redact = fastRedact({ paths: ['a.b.c'] })
  throws(() => redact(1))
  end()
})

test('throws when passed non-object number using [strict: true]', ({ end, throws }) => {
  const redact = fastRedact({ paths: ['a.b.c'], strict: true })
  throws(() => redact(1))
  end()
})

test('returns JSON.stringified value when passed non-object using [strict: false] and no serialize option', ({ end, is, doesNotThrow }) => {
  const redactDefaultSerialize = fastRedact({ paths: ['a.b.c'], strict: false })

  // expectedOutputs holds `JSON.stringify`ied versions of each primitive.
  // We write them out explicitly though to make the test a bit clearer.
  const primitives = [null, undefined, 'A', 1, false]
  const expectedOutputs = ['null', undefined, '"A"', '1', 'false']

  primitives.forEach((it, i) => {
    doesNotThrow(() => redactDefaultSerialize(it))
    const res = redactDefaultSerialize(it)
    is(res, expectedOutputs[i])
  })

  end()
})

test('returns custom serialized value when passed non-object using [strict: false, serialize: fn]', ({ end, is, doesNotThrow }) => {
  const customSerialize = (v) => `Hello ${v}!`
  const redactCustomSerialize = fastRedact({
    paths: ['a.b.c'],
    strict: false,
    serialize: customSerialize
  })

  const primitives = [null, undefined, 'A', 1, false]

  primitives.forEach((it) => {
    doesNotThrow(() => redactCustomSerialize(it))
    const res = redactCustomSerialize(it)
    is(res, customSerialize(it))
  })

  end()
})

test('returns original value when passed non-object using [strict: false, serialize: false]', ({ end, is, doesNotThrow }) => {
  const redactSerializeFalse = fastRedact({
    paths: ['a.b.c'],
    strict: false,
    serialize: false
  })

  const primitives = [null, undefined, 'A', 1, false]

  primitives.forEach((it) => {
    doesNotThrow(() => redactSerializeFalse(it))
    const res = redactSerializeFalse(it)
    is(res, it)
  })

  end()
})

test('throws if a path is not a string', ({ end, is, throws }) => {
  throws((e) => {
    fastRedact({ paths: [1] })
  }, Error('fast-redact - Paths must be strings'))
  throws((e) => {
    fastRedact({ paths: [null] })
  }, Error('fast-redact - Paths must be strings'))
  throws((e) => {
    fastRedact({ paths: [undefined] })
  }, Error('fast-redact - Paths must be strings'))
  throws((e) => {
    fastRedact({ paths: [{}] })
  }, Error('fast-redact - Paths must be strings'))
  end()
})

test('throws when passed illegal paths', ({ end, is, throws }) => {
  const err = (s) => Error(`fast-redact – Invalid path (${s})`)
  throws((e) => {
    fastRedact({ paths: ['@'] })
  }, err('@'))
  throws((e) => {
    fastRedact({ paths: ['0'] })
  }, err('0'))
  throws((e) => {
    fastRedact({ paths: ['〇'] })
  }, err('〇'))
  throws((e) => {
    fastRedact({ paths: ['a.1.c'] })
  }, err('a.1.c'))
  throws((e) => {
    fastRedact({ paths: ['a..c'] })
  }, err('a..c'))
  throws((e) => {
    fastRedact({ paths: ['1..c'] })
  }, err('1..c'))
  throws((e) => {
    fastRedact({ paths: ['a = b'] })
  }, err('a = b'))
  throws((e) => {
    fastRedact({ paths: ['a(b)'] })
  }, err('a(b)'))
  throws((e) => {
    fastRedact({ paths: ['//a.b.c'] })
  }, err('//a.b.c'))
  throws((e) => {
    fastRedact({ paths: ['\\a.b.c'] })
  }, err('\\a.b.c'))
  throws((e) => {
    fastRedact({ paths: ['a.#.c'] })
  }, err('a.#.c'))
  throws((e) => {
    fastRedact({ paths: ['~~a.b.c'] })
  }, err('~~a.b.c'))
  throws((e) => {
    fastRedact({ paths: ['^a.b.c'] })
  }, err('^a.b.c'))
  throws((e) => {
    fastRedact({ paths: ['a + b'] })
  }, err('a + b'))
  throws((e) => {
    fastRedact({ paths: ['return a + b'] })
  }, err('return a + b'))
  throws((e) => {
    fastRedact({ paths: ['a / b'] })
  }, err('a / b'))
  throws((e) => {
    fastRedact({ paths: ['a * b'] })
  }, err('a * b'))
  throws((e) => {
    fastRedact({ paths: ['a - b'] })
  }, err('a - b'))
  throws((e) => {
    fastRedact({ paths: ['a ** b'] })
  }, err('a ** b'))
  throws((e) => {
    fastRedact({ paths: ['a % b'] })
  }, err('a % b'))
  throws((e) => {
    fastRedact({ paths: ['a.b*.c'] })
  }, err('a.b*.c'))
  throws((e) => {
    fastRedact({ paths: ['a;global.foo = "bar"'] })
  }, err('a;global.foo = "bar"'))
  throws((e) => {
    fastRedact({ paths: ['a;while(1){}'] })
  }, err('a;while(1){}'))
  throws((e) => {
    fastRedact({ paths: ['a//'] })
  }, err('a//'))
  throws((e) => {
    fastRedact({ paths: ['a/*foo*/'] })
  }, err('a/*foo*/'))
  throws((e) => {
    fastRedact({ paths: ['a,o.b'] })
  }, err('a,o.b'))
  throws((e) => {
    fastRedact({ paths: ['a = o.b'] })
  }, err('a = o.b'))
  throws((e) => {
    fastRedact({ paths: ['a\n'] })
  }, err('a\n'))
  throws((e) => {
    fastRedact({ paths: ['a\r'] })
  }, err('a\r'))
  end()
})

test('throws if more than one wildcard in a path', ({ end, throws }) => {
  throws(() => {
    fastRedact({ paths: ['a.*.x.*'], serialize: false })
  }, Error('fast-redact – Only one wildcard per path is supported'))
  end()
})

test('throws if a custom serializer is used and remove is true', ({ end, throws }) => {
  throws(() => {
    fastRedact({ paths: ['a'], serialize: (o) => o, remove: true })
  }, Error('fast-redact – remove option may only be set when serializer is JSON.stringify'))
  end()
})

test('throws if serialize is false and remove is true', ({ end, throws }) => {
  throws(() => {
    fastRedact({ paths: ['a'], serialize: false, remove: true })
  }, Error('fast-redact – remove option may only be set when serializer is JSON.stringify'))
  end()
})

test('masks according to supplied censor', ({ end, is }) => {
  const censor = 'test'
  const redact = fastRedact({ paths: ['a'], censor, serialize: false })
  is(redact({ a: 'a' }).a, censor)
  end()
})

test('redact.restore function is available when serialize is false', ({ end, is }) => {
  const censor = 'test'
  const redact = fastRedact({ paths: ['a'], censor, serialize: false })
  is(typeof redact.restore, 'function')
  end()
})

test('redact.restore function places original values back in place', ({ end, is }) => {
  const censor = 'test'
  const redact = fastRedact({ paths: ['a'], censor, serialize: false })
  const o = { a: 'a' }
  redact(o)
  is(o.a, censor)
  redact.restore(o)
  is(o.a, 'a')
  end()
})

test('masks according to supplied censor function', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a'], censor: censorFct, serialize: false })
  is(redact({ a: '0123456' }).a, 'xxx56')
  end()
})

test('masks according to supplied censor function with wildcards', ({ end, is }) => {
  const redact = fastRedact({ paths: '*', censor: censorFct, serialize: false })
  is(redact({ a: '0123456' }).a, 'xxx56')
  end()
})

test('masks according to supplied censor function with nested wildcards', ({ end, is }) => {
  const redact = fastRedact({ paths: ['*.b'], censor: censorFct, serialize: false })
  is(redact({ a: { b: '0123456' } }).a.b, 'xxx56')
  is(redact({ c: { b: '0123456', d: 'pristine' } }).c.b, 'xxx56')
  is(redact({ c: { b: '0123456', d: 'pristine' } }).c.d, 'pristine')
  end()
})

test('redact.restore function places original values back in place with censor function', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a'], censor: censorFct, serialize: false })
  const o = { a: 'qwerty' }
  redact(o)
  is(o.a, 'xxxty')
  redact.restore(o)
  is(o.a, 'qwerty')
  end()
})

test('serializes with JSON.stringify by default', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a'] })
  const o = { a: 'a' }
  is(redact(o), `{"a":"${censor}"}`)
  is(o.a, 'a')
  end()
})

test('removes during serialization instead of redacting when remove option is true', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a'], remove: true })
  const o = { a: 'a', b: 'b' }
  is(redact(o), `{"b":"b"}`)
  is(o.a, 'a')
  end()
})

test('serializes with JSON.stringify if serialize is true', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a'], serialize: true })
  const o = { a: 'a' }
  is(redact(o), `{"a":"${censor}"}`)
  is(o.a, 'a')
  end()
})

test('serializes with JSON.stringify if serialize is not a function', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a'], serialize: {} })
  const o = { a: 'a' }
  is(redact(o), `{"a":"${censor}"}`)
  is(o.a, 'a')
  end()
})

test('serializes with custom serializer if supplied', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a'], serialize: (o) => JSON.stringify(o, 0, 2) })
  const o = { a: 'a' }
  is(redact(o), `{\n  "a": "${censor}"\n}`)
  is(o.a, 'a')
  end()
})

test('redacts parent keys', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a.b.c'], serialize: false })
  const result = redact({ a: { b: { c: 's' }, d: { a: 's', b: 's', c: 's' } } })
  is(result.a.b.c, censor)
  end()
})

test('supports paths with array indexes', ({ end, same }) => {
  const redact = fastRedact({ paths: ['insideArray.like[3].this'], serialize: false })
  same(redact({ insideArray: { like: ['a', 'b', 'c', { this: { foo: 'meow' } }] } }), { insideArray: { like: ['a', 'b', 'c', { this: censor }] } })
  end()
})

test('censor may be any type, including function', ({ end, same }) => {
  const redactToString = fastRedact({ paths: ['a.b.c', 'a.b.d.*'], censor: 'censor', serialize: false })
  const redactToUndefined = fastRedact({ paths: ['a.b.c', 'a.b.d.*'], censor: undefined, serialize: false })
  const sym = Symbol('sym')
  const redactToSymbol = fastRedact({ paths: ['a.b.c', 'a.b.d.*'], censor: sym, serialize: false })
  const redactToNumber = fastRedact({ paths: ['a.b.c', 'a.b.d.*'], censor: 0, serialize: false })
  const redactToBoolean = fastRedact({ paths: ['a.b.c', 'a.b.d.*'], censor: false, serialize: false })
  const redactToNull = fastRedact({ paths: ['a.b.c', 'a.b.d.*'], censor: null, serialize: false })
  const redactToObject = fastRedact({ paths: ['a.b.c', 'a.b.d.*'], censor: { redacted: true }, serialize: false })
  const redactToArray = fastRedact({ paths: ['a.b.c', 'a.b.d.*'], censor: ['redacted'], serialize: false })
  const redactToBuffer = fastRedact({ paths: ['a.b.c', 'a.b.d.*'], censor: Buffer.from('redacted'), serialize: false })
  const redactToError = fastRedact({ paths: ['a.b.c', 'a.b.d.*'], censor: Error('redacted'), serialize: false })
  const redactToFunction = fastRedact({ paths: ['a.b.c', 'a.b.d.*'], censor: () => 'redacted', serialize: false })
  same(redactToString({ a: { b: { c: 's', d: { x: 's', y: 's' } } } }), { a: { b: { c: 'censor', d: { x: 'censor', y: 'censor' } } } })
  same(redactToUndefined({ a: { b: { c: 's', d: { x: 's', y: 's' } } } }), { a: { b: { c: undefined, d: { x: undefined, y: undefined } } } })
  same(redactToSymbol({ a: { b: { c: 's', d: { x: 's', y: 's' } } } }), { a: { b: { c: sym, d: { x: sym, y: sym } } } })
  same(redactToNumber({ a: { b: { c: 's', d: { x: 's', y: 's' } } } }), { a: { b: { c: 0, d: { x: 0, y: 0 } } } })
  same(redactToBoolean({ a: { b: { c: 's', d: { x: 's', y: 's' } } } }), { a: { b: { c: false, d: { x: false, y: false } } } })
  same(redactToNull({ a: { b: { c: 's', d: { x: 's', y: 's' } } } }), { a: { b: { c: null, d: { x: null, y: null } } } })
  same(redactToObject({ a: { b: { c: 's', d: { x: 's', y: 's' } } } }), { a: { b: { c: { redacted: true }, d: { x: { redacted: true }, y: { redacted: true } } } } })
  same(redactToArray({ a: { b: { c: 's', d: { x: 's', y: 's' } } } }), { a: { b: { c: ['redacted'], d: { x: ['redacted'], y: ['redacted'] } } } })
  same(redactToBuffer({ a: { b: { c: 's', d: { x: 's', y: 's' } } } }), { a: { b: { c: Buffer.from('redacted'), d: { x: Buffer.from('redacted'), y: Buffer.from('redacted') } } } })
  same(redactToError({ a: { b: { c: 's', d: { x: 's', y: 's' } } } }), { a: { b: { c: Error('redacted'), d: { x: Error('redacted'), y: Error('redacted') } } } })
  same(redactToFunction({ a: { b: { c: 's', d: { x: 's', y: 's' } } } }), { a: { b: { c: 'redacted', d: { x: 'redacted', y: 'redacted' } } } })
  end()
})

test('supports multiple paths from the same root', ({ end, same }) => {
  const redact = fastRedact({ paths: ['deep.bar.shoe', 'deep.baz.shoe', 'deep.foo', 'deep.not.there.sooo', 'deep.fum.shoe'], serialize: false })
  same(redact({ deep: { bar: 'hmm', baz: { shoe: { k: 1 } }, foo: {}, fum: { shoe: 'moo' } } }), { deep: { bar: 'hmm', baz: { shoe: censor }, foo: censor, fum: { shoe: censor } } })
  end()
})

test('supports strings in bracket notation paths (single quote)', ({ end, is }) => {
  const redact = fastRedact({ paths: [`a['@#!='].c`], serialize: false })
  const result = redact({ a: { '@#!=': { c: 's' }, d: { a: 's', b: 's', c: 's' } } })
  is(result.a['@#!='].c, censor)
  end()
})

test('supports strings in bracket notation paths (double quote)', ({ end, is }) => {
  const redact = fastRedact({ paths: [`a["@#!="].c`], serialize: false })
  const result = redact({ a: { '@#!=': { c: 's' }, d: { a: 's', b: 's', c: 's' } } })
  is(result.a['@#!='].c, censor)
  end()
})

test('supports strings in bracket notation paths (backtick quote)', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a[`@#!=`].c'], serialize: false })
  const result = redact({ a: { '@#!=': { c: 's' }, d: { a: 's', b: 's', c: 's' } } })
  is(result.a['@#!='].c, censor)
  end()
})

test('allows * within a bracket notation string', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a["*"].c'], serialize: false })
  const result = redact({ a: { '*': { c: 's', x: 1 } } })
  is(result.a['*'].c, censor)
  is(result.a['*'].x, 1)
  end()
})

test('redacts parent keys – restore', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a.b.c'], serialize: false })
  const result = redact({ a: { b: { c: 's' }, d: { a: 's', b: 's', c: 's' } } })
  is(result.a.b.c, censor)
  redact.restore(result)
  is(result.a.b.c, 's')
  end()
})

test('handles null proto objects', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a.b.c'], serialize: false })
  const result = redact({ __proto__: null, a: { b: { c: 's' }, d: { a: 's', b: 's', c: 's' } } })
  is(result.a.b.c, censor)
  end()
})

test('handles null proto objects – restore', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a.b.c'], serialize: false })
  const result = redact({ __proto__: null, a: { b: { c: 's' }, d: { a: 's', b: 's', c: 's' } } })
  is(result.a.b.c, censor)
  redact.restore(result, 's')
  is(result.a.b.c, 's')
  end()
})

test('handles paths that do not match object structure', ({ end, same }) => {
  const redact = fastRedact({ paths: ['x.y.z'], serialize: false })
  same(redact({ a: { b: { c: 's' } } }), { a: { b: { c: 's' } } })
  end()
})

test('ignores missing paths in object', ({ end, same }) => {
  const redact = fastRedact({ paths: ['a.b.c', 'a.z.d', 'a.b.z'], serialize: false })
  same(redact({ a: { b: { c: 's' } } }), { a: { b: { c: censor } } })
  end()
})

test('ignores missing paths in object – restore', ({ end, doesNotThrow }) => {
  const redact = fastRedact({ paths: ['a.b.c', 'a.z.d', 'a.b.z'], serialize: false })
  const o = { a: { b: { c: 's' } } }
  redact(o)
  doesNotThrow(() => {
    redact.restore(o)
  })

  end()
})

test('gracefully handles primitives that match intermediate keys in paths', ({ end, same }) => {
  const redact = fastRedact({ paths: ['a.b.c', 'a.b.c.d'], serialize: false })
  same(redact({ a: { b: null } }), { a: { b: null } })
  same(redact({ a: { b: 's' } }), { a: { b: 's' } })
  same(redact({ a: { b: 1 } }), { a: { b: 1 } })
  same(redact({ a: { b: undefined } }), { a: { b: undefined } })
  same(redact({ a: { b: true } }), { a: { b: true } })
  const sym = Symbol('sym')
  same(redact({ a: { b: sym } }), { a: { b: sym } })
  end()
})

test('handles circulars', ({ end, is, same }) => {
  const redact = fastRedact({ paths: ['bar.baz.baz'], serialize: false })
  const bar = { b: 2 }
  const o = { a: 1, bar }
  bar.baz = bar
  o.bar.baz = o.bar
  same(redact(o), { a: 1, bar: { b: 2, baz: censor } })
  end()
})

test('handles circulars – restore', ({ end, is, same }) => {
  const redact = fastRedact({ paths: ['bar.baz.baz'], serialize: false })
  const bar = { b: 2 }
  const o = { a: 1, bar }
  bar.baz = bar
  o.bar.baz = o.bar
  is(o.bar.baz, bar)
  redact(o)
  is(o.bar.baz, censor)
  redact.restore(o)
  is(o.bar.baz, bar)
  end()
})

test('handles circulars and cross references – restore', ({ end, is, same }) => {
  const redact = fastRedact({ paths: ['bar.baz.baz', 'cf.bar'], serialize: false })
  const bar = { b: 2 }
  const o = { a: 1, bar, cf: { bar } }
  bar.baz = bar
  o.bar.baz = o.bar
  is(o.bar.baz, bar)
  is(o.cf.bar, bar)
  redact(o)
  is(o.bar.baz, censor)
  is(o.cf.bar, censor)
  redact.restore(o)
  is(o.bar.baz, bar)
  is(o.cf.bar, bar)
  end()
})

test('ultimate wildcards – shallow', ({ end, same }) => {
  const redact = fastRedact({ paths: ['test.*'], serialize: false })
  same(redact({ test: { baz: 1, bar: 'private' } }), { test: { baz: censor, bar: censor } })
  end()
})

test('ultimate wildcards – deep', ({ end, same }) => {
  const redact = fastRedact({ paths: ['deep.bar.baz.ding.*'], serialize: false })
  same(redact({ deep: { a: 1, bar: { b: 2, baz: { c: 3, ding: { d: 4, e: 5, f: 'six' } } } } }), { deep: { a: 1, bar: { b: 2, baz: { c: 3, ding: { d: censor, e: censor, f: censor } } } } })
  end()
})

test('ultimate wildcards - array – shallow', ({ end, same }) => {
  const redact = fastRedact({ paths: ['array[*]'], serialize: false })
  same(redact({ array: ['a', 'b', 'c', 'd'] }), { array: [censor, censor, censor, censor] })
  end()
})

test('ultimate wildcards – array – deep', ({ end, same }) => {
  const redact = fastRedact({ paths: ['deepArray.down.here[*]'], serialize: false })
  same(redact({ deepArray: { down: { here: ['a', 'b', 'c'] } } }), { deepArray: { down: { here: [censor, censor, censor] } } })
  end()
})

test('ultimate wildcards – array – single index', ({ end, same }) => {
  const redact = fastRedact({ paths: ['insideArray.like[3].this.*'], serialize: false })
  same(redact({ insideArray: { like: ['a', 'b', 'c', { this: { foo: 'meow' } }] } }), { insideArray: { like: ['a', 'b', 'c', { this: { foo: censor } }] } })
  end()
})

test('ultimate wildcards - handles null proto objects', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a.b.c'], serialize: false })
  const result = redact({ __proto__: null, a: { b: { c: 's' }, d: { a: 's', b: 's', c: 's' } } })
  is(result.a.b.c, censor)
  end()
})

test('ultimate wildcards - handles paths that do not match object structure', ({ end, same }) => {
  const redact = fastRedact({ paths: ['x.y.z'], serialize: false })
  same(redact({ a: { b: { c: 's' } } }), { a: { b: { c: 's' } } })
  end()
})

test('ultimate wildcards - gracefully handles primitives that match intermediate keys in paths', ({ end, same }) => {
  const redact = fastRedact({ paths: ['a.b.c', 'a.b.c.d'], serialize: false })
  same(redact({ a: { b: null } }), { a: { b: null } })
  same(redact({ a: { b: 's' } }), { a: { b: 's' } })
  same(redact({ a: { b: 1 } }), { a: { b: 1 } })
  same(redact({ a: { b: undefined } }), { a: { b: undefined } })
  same(redact({ a: { b: true } }), { a: { b: true } })
  const sym = Symbol('sym')
  same(redact({ a: { b: sym } }), { a: { b: sym } })
  end()
})

test('ultimate wildcards – handles circulars', ({ end, is, same }) => {
  const redact = fastRedact({ paths: ['bar.baz.*'], serialize: false })
  const bar = { b: 2 }
  const o = { a: 1, bar }
  bar.baz = bar
  o.bar.baz = o.bar
  same(redact(o), { a: 1, bar: { b: censor, baz: censor } })
  end()
})

test('ultimate wildcards – handles circulars – restore', ({ end, is, same }) => {
  const redact = fastRedact({ paths: ['bar.baz.*'], serialize: false })
  const bar = { b: 2 }
  const o = { a: 1, bar }
  bar.baz = bar
  o.bar.baz = o.bar
  is(o.bar.baz, bar)
  redact(o)
  is(o.bar.baz, censor)
  redact.restore(o)
  is(o.bar.baz, bar)
  end()
})

test('ultimate wildcards – handles circulars and cross references – restore', ({ end, is, same }) => {
  const redact = fastRedact({ paths: ['bar.baz.*', 'cf.*'], serialize: false })
  const bar = { b: 2 }
  const o = { a: 1, bar, cf: { bar } }
  bar.baz = bar
  o.bar.baz = o.bar
  is(o.bar.baz, bar)
  is(o.cf.bar, bar)
  redact(o)
  is(o.bar.baz, censor)
  is(o.cf.bar, censor)
  redact.restore(o)
  is(o.bar.baz, bar)
  is(o.cf.bar, bar)
  end()
})

test('static + wildcards', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a.b.c', 'a.d.*', 'a.b.z.*'], serialize: false })
  const result = redact({ a: { b: { c: 's', z: { x: 's', y: 's' } }, d: { a: 's', b: 's', c: 's' } } })

  is(result.a.b.c, censor)
  is(result.a.d.a, censor)
  is(result.a.d.b, censor)
  is(result.a.d.c, censor)
  is(result.a.b.z.x, censor)
  is(result.a.b.z.y, censor)
  end()
})

test('static + wildcards reuse', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a.b.c', 'a.d.*'], serialize: false })
  const result = redact({ a: { b: { c: 's' }, d: { a: 's', b: 's', c: 's' } } })

  is(result.a.b.c, censor)
  is(result.a.d.a, censor)
  is(result.a.d.b, censor)
  is(result.a.d.c, censor)

  redact.restore(result)

  const result2 = redact({ a: { b: { c: 's' }, d: { a: 's', b: 's', c: 's' } } })
  is(result2.a.b.c, censor)
  is(result2.a.d.a, censor)
  is(result2.a.d.b, censor)
  is(result2.a.d.c, censor)

  redact.restore(result2)
  end()
})

test('parent wildcard – first position', ({ end, is }) => {
  const redact = fastRedact({ paths: ['*.c'], serialize: false })
  const result = redact({ b: { c: 's' }, d: { a: 's', b: 's', c: 's' } })
  is(result.b.c, censor)
  is(result.d.a, 's')
  is(result.d.b, 's')
  is(result.d.c, censor)
  end()
})

test('parent wildcard – one following key', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a.*.c'], serialize: false })
  const result = redact({ a: { b: { c: 's' }, d: { a: 's', b: 's', c: 's' } } })
  is(result.a.b.c, censor)
  is(result.a.d.a, 's')
  is(result.a.d.b, 's')
  is(result.a.d.c, censor)
  end()
})

test('restore parent wildcard  – one following key', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a.*.c'], serialize: false })
  const result = redact({ a: { b: { c: 's' }, d: { a: 's', b: 's', c: 's' } } })
  redact.restore(result)
  is(result.a.b.c, 's')
  is(result.a.d.a, 's')
  is(result.a.d.b, 's')
  is(result.a.d.c, 's')
  end()
})

test('parent wildcard – one following key – reuse', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a.*.c'], serialize: false })
  const result = redact({ a: { b: { c: 's' }, d: { a: 's', b: 's', c: 's' } } })
  is(result.a.b.c, censor)
  is(result.a.d.a, 's')
  is(result.a.d.b, 's')
  is(result.a.d.c, censor)
  const result2 = redact({ a: { b: { c: 's' }, d: { a: 's', b: 's', c: 's' } } })
  is(result2.a.b.c, censor)
  is(result2.a.d.a, 's')
  is(result2.a.d.b, 's')
  is(result2.a.d.c, censor)
  redact.restore(result2)
  end()
})

test('parent wildcard – two following keys', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a.*.x.c'], serialize: false })
  const result = redact({ a: { b: { x: { c: 's' } }, d: { x: { a: 's', b: 's', c: 's' } } } })
  is(result.a.b.x.c, censor)
  is(result.a.d.x.a, 's')
  is(result.a.d.x.b, 's')
  is(result.a.d.x.c, censor)
  end()
})

test('parent wildcard  – two following keys – reuse', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a.*.x.c'], serialize: false })
  const result = redact({ a: { b: { x: { c: 's' } }, d: { x: { a: 's', b: 's', c: 's' } } } })
  is(result.a.b.x.c, censor)
  is(result.a.d.x.a, 's')
  is(result.a.d.x.b, 's')
  is(result.a.d.x.c, censor)
  redact.restore(result)
  const result2 = redact({ a: { b: { x: { c: 's' } }, d: { x: { a: 's', b: 's', c: 's' } } } })
  is(result2.a.b.x.c, censor)
  is(result2.a.d.x.a, 's')
  is(result2.a.d.x.b, 's')
  is(result2.a.d.x.c, censor)
  end()
})

test('restore parent wildcard  – two following keys', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a.*.x.c'], serialize: false })
  const result = redact({ a: { b: { x: { c: 's' } }, d: { x: { a: 's', b: 's', c: 's' } } } })
  redact.restore(result)
  is(result.a.b.x.c, 's')
  is(result.a.d.x.a, 's')
  is(result.a.d.x.b, 's')
  is(result.a.d.x.c, 's')
  end()
})

test('parent wildcard - array', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a.b[*].x'], serialize: false })
  const result = redact({ a: { b: [{ x: 1 }, { a: 2 }], d: { a: 's', b: 's', c: 's' } } })
  is(result.a.b[0].x, censor)
  is(result.a.b[1].a, 2)
  is(result.a.d.a, 's')
  is(result.a.d.b, 's')
  end()
})

test('parent wildcards – array – single index', ({ end, same }) => {
  const redact = fastRedact({ paths: ['insideArray.like[3].*.foo'], serialize: false })
  same(redact({ insideArray: { like: ['a', 'b', 'c', { this: { foo: 'meow' } }] } }), { insideArray: { like: ['a', 'b', 'c', { this: { foo: censor } }] } })
  end()
})

test('parent wildcards - handles null proto objects', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a.*.c'], serialize: false })
  const result = redact({ __proto__: null, a: { b: { c: 's' }, d: { a: 's', b: 's', c: 's' } } })
  is(result.a.b.c, censor)
  end()
})

test('parent wildcards - handles paths that do not match object structure', ({ end, same }) => {
  const redact = fastRedact({ paths: ['a.*.y.z'], serialize: false })
  same(redact({ a: { b: { c: 's' } } }), { a: { b: { c: 's' } } })
  end()
})

test('parent wildcards - gracefully handles primitives that match intermediate keys in paths', ({ end, same }) => {
  const redact = fastRedact({ paths: ['a.*.c'], serialize: false })
  same(redact({ a: { b: null } }), { a: { b: null } })
  same(redact({ a: { b: 's' } }), { a: { b: 's' } })
  same(redact({ a: { b: 1 } }), { a: { b: 1 } })
  same(redact({ a: { b: undefined } }), { a: { b: undefined } })
  same(redact({ a: { b: true } }), { a: { b: true } })
  const sym = Symbol('sym')
  same(redact({ a: { b: sym } }), { a: { b: sym } })
  end()
})

test('parent wildcards – handles circulars', ({ end, is, same }) => {
  const redact = fastRedact({ paths: ['x.*.baz'], serialize: false })
  const bar = { b: 2 }
  const o = { x: { a: 1, bar } }
  bar.baz = bar
  o.x.bar.baz = o.x.bar
  same(redact(o), { x: { a: 1, bar: { b: 2, baz: censor } } })
  end()
})

test('parent wildcards – handles circulars – restore', ({ end, is, same }) => {
  const redact = fastRedact({ paths: ['x.*.baz'], serialize: false })
  const bar = { b: 2 }
  const o = { x: { a: 1, bar } }
  bar.baz = bar
  o.x.bar.baz = o.x.bar
  is(o.x.bar.baz, bar)
  redact(o)
  is(o.x.a, 1)
  is(o.x.bar.baz, censor)
  redact.restore(o)
  is(o.x.bar.baz, bar)
  end()
})

test('parent wildcards – handles circulars and cross references – restore', ({ end, is, same }) => {
  const redact = fastRedact({ paths: ['x.*.baz', 'x.*.cf.bar'], serialize: false })
  const bar = { b: 2 }
  const o = { x: { a: 1, bar, y: { cf: { bar } } } }
  bar.baz = bar
  o.x.bar.baz = o.x.bar
  is(o.x.bar.baz, bar)
  is(o.x.y.cf.bar, bar)
  redact(o)
  is(o.x.bar.baz, censor)
  is(o.x.y.cf.bar, censor)
  redact.restore(o)
  is(o.x.bar.baz, bar)
  is(o.x.y.cf.bar, bar)
  end()
})

test('parent wildcards – handles missing paths', ({ end, is, same }) => {
  const redact = fastRedact({ paths: ['z.*.baz'] })
  const o = { a: { b: { c: 's' }, d: { a: 's', b: 's', c: 's' } } }
  is(redact(o), JSON.stringify(o))
  end()
})

test('ultimate wildcards – handles missing paths', ({ end, is, same }) => {
  const redact = fastRedact({ paths: ['z.*'] })
  const o = { a: { b: { c: 's' }, d: { a: 's', b: 's', c: 's' } } }
  is(redact(o), JSON.stringify(o))
  end()
})

test('parent wildcards – removes during serialization instead of redacting when remove option is true', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a.*.c'], remove: true })
  const o = { a: { b: { c: 'c' }, x: { c: 1 } } }
  is(redact(o), `{"a":{"b":{},"x":{}}}`)
  end()
})

test('ultimate wildcards – removes during serialization instead of redacting when remove option is true', ({ end, is }) => {
  const redact = fastRedact({ paths: ['a.b.*'], remove: true })
  const o = { a: { b: { c: 'c' }, x: { c: 1 } } }
  is(redact(o), `{"a":{"b":{},"x":{"c":1}}}`)
  end()
})

test('supports leading bracket notation', ({ end, is }) => {
  const redact = fastRedact({ paths: ['["a"].b.c'] })
  const o = { a: { b: { c: 'd' } } }
  is(redact(o), `{"a":{"b":{"c":"${censor}"}}}`)
  end()
})

test('supports leading bracket notation containing non-legal keyword characters', ({ end, is }) => {
  const redact = fastRedact({ paths: ['["a-x"].b.c'] })
  const o = { 'a-x': { b: { c: 'd' } } }
  is(redact(o), `{"a-x":{"b":{"c":"${censor}"}}}`)
  end()
})

test('supports single leading bracket', ({ end, is }) => {
  const censor = 'test'
  const redact = fastRedact({ paths: ['["a"]'], censor, serialize: false })
  is(redact({ a: 'a' }).a, censor)
  end()
})

test('supports single leading bracket containing non-legal keyword characters', ({ end, is }) => {
  const censor = 'test'
  const redact = fastRedact({ paths: ['["a-x"]'], censor, serialize: false })
  is(redact({ 'a-x': 'a' })['a-x'], censor)
  end()
})

test('(leading brackets) ultimate wildcards – handles circulars and cross references – restore', ({ end, is, same }) => {
  const redact = fastRedact({ paths: ['bar.baz.*', 'cf.*'], serialize: false })
  const bar = { b: 2 }
  const o = { a: 1, bar, cf: { bar } }
  bar.baz = bar
  o.bar.baz = o.bar
  is(o.bar.baz, bar)
  is(o.cf.bar, bar)
  redact(o)
  is(o.bar.baz, censor)
  is(o.cf.bar, censor)
  redact.restore(o)
  is(o.bar.baz, bar)
  is(o.cf.bar, bar)
  end()
})

test('(leading brackets) parent wildcards – handles circulars and cross references – restore', ({ end, is, same }) => {
  const redact = fastRedact({ paths: ['["x"].*.baz', '["x"].*.cf.bar'], serialize: false })
  const bar = { b: 2 }
  const o = { x: { a: 1, bar, y: { cf: { bar } } } }
  bar.baz = bar
  o.x.bar.baz = o.x.bar
  is(o.x.bar.baz, bar)
  is(o.x.y.cf.bar, bar)
  redact(o)
  is(o.x.bar.baz, censor)
  is(o.x.y.cf.bar, censor)
  redact.restore(o)
  is(o.x.bar.baz, bar)
  is(o.x.y.cf.bar, bar)
  end()
})

test('(leading brackets) ultimate wildcards – handles missing paths', ({ end, is, same }) => {
  const redact = fastRedact({ paths: ['["z"].*'] })
  const o = { a: { b: { c: 's' }, d: { a: 's', b: 's', c: 's' } } }
  is(redact(o), JSON.stringify(o))
  end()
})

test('(leading brackets) static + wildcards reuse', ({ end, is }) => {
  const redact = fastRedact({ paths: ['["a"].b.c', '["a"].d.*'], serialize: false })
  const result = redact({ a: { b: { c: 's' }, d: { a: 's', b: 's', c: 's' } } })

  is(result.a.b.c, censor)
  is(result.a.d.a, censor)
  is(result.a.d.b, censor)
  is(result.a.d.c, censor)

  redact.restore(result)

  const result2 = redact({ a: { b: { c: 's' }, d: { a: 's', b: 's', c: 's' } } })
  is(result2.a.b.c, censor)
  is(result2.a.d.a, censor)
  is(result2.a.d.b, censor)
  is(result2.a.d.c, censor)

  redact.restore(result2)
  end()
})

test('correctly restores original object when a path does not match object', ({ end, is }) => {
  const redact = fastRedact({ paths: ['foo.bar'], strict: false })
  const o = {}
  is(redact({ foo: o }), '{"foo":{}}')
  is(o.hasOwnProperty('bar'), false)
  end()
})

test('correctly restores original object when a matching path has value of `undefined`', ({ end, is }) => {
  const redact = fastRedact({ paths: ['foo.bar'], strict: false })
  const o = { bar: undefined }
  is(redact({ foo: o }), '{"foo":{}}')
  is(o.hasOwnProperty('bar'), true)
  is(o.bar, undefined)
  end()
})

test('handles multiple paths with leading brackets', ({ end, is }) => {
  const redact = fastRedact({ paths: ['["x-y"]', '["y-x"]'] })
  const o = { 'x-y': 'test', 'y-x': 'test2' }
  is(redact(o), '{"x-y":"[REDACTED]","y-x":"[REDACTED]"}')
  end()
})

test('handles objects with and then without target paths', ({ end, is }) => {
  const redact = fastRedact({ paths: ['test'] })
  const o1 = { test: 'check' }
  const o2 = {}
  is(redact(o1), '{"test":"[REDACTED]"}')
  is(redact(o2), '{}')
  // run each check twice to ensure no mutations
  is(redact(o1), '{"test":"[REDACTED]"}')
  is(redact(o2), '{}')
  is('test' in o1, true)
  is('test' in o2, false)
  end()
})

test('handles leading wildcards and null values', ({ end, is }) => {
  const redact = fastRedact({ paths: ['*.test'] })
  const o = { prop: null }
  is(redact(o), '{"prop":null}')
  is(o.prop, null)
  end()
})

test('handles keys with dots', ({ end, is }) => {
  const redactSingleQ = fastRedact({ paths: [`a['b.c']`], serialize: false })
  const redactDoubleQ = fastRedact({ paths: [`a["b.c"]`], serialize: false })
  const redactBacktickQ = fastRedact({ paths: ['a[`b.c`]'], serialize: false })
  const redactNum = fastRedact({ paths: [`a[-1.2]`], serialize: false })
  const redactLeading = fastRedact({ paths: [`["b.c"]`], serialize: false })
  is(redactSingleQ({ a: { 'b.c': 'x', '-1.2': 'x' } }).a['b.c'], censor)
  is(redactDoubleQ({ a: { 'b.c': 'x', '-1.2': 'x' } }).a['b.c'], censor)
  is(redactBacktickQ({ a: { 'b.c': 'x', '-1.2': 'x' } }).a['b.c'], censor)
  is(redactNum({ a: { 'b.c': 'x', '-1.2': 'x' } }).a['-1.2'], censor)
  is(redactLeading({ 'b.c': 'x', '-1.2': 'x' })['b.c'], censor)
  end()
})
