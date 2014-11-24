module('lunr.Store')

test('adding document tokens to the document store', function () {
  var docStore = new lunr.Store,
      tokens = ['eggs', 'ham']

  docStore.set(1, tokens)
  deepEqual(docStore.get(1), tokens)
})

test('getting the number of items in the document store', function () {
  var docStore = new lunr.Store

  equal(docStore.length, 0)
  docStore.set(1, 'foo')
  equal(docStore.length, 1)
})

test('checking whether the store contains a key', function () {
  var store = new lunr.Store

  ok(!store.has('foo'))
  store.set('foo', 1)
  ok(store.has('foo'))
})

test('removing an element from the store', function () {
  var store = new lunr.Store

  store.set('foo', 1)
  ok(store.has('foo'))
  equal(store.length, 1)
  store.remove('foo')
  ok(!store.has('foo'))
  equal(store.length, 0)
})

test('serialising', function () {
  var store = new lunr.Store

  deepEqual(store.toJSON(), { store: {}, length: 0 })

  store.set(1, ['eggs', 'ham'])

  deepEqual(store.toJSON(), { store: { 1: ['eggs', 'ham'] }, length: 1 })
})

test('loading serialised data', function () {
  var serialisedData = {
    length: 1,
    store: {
      1: ['eggs', 'ham']
    }
  }

  var store = lunr.Store.load(serialisedData)

  equal(store.length, 1)
  deepEqual(store.get(1), lunr.SortedSet.load(['eggs', 'ham']))
})
