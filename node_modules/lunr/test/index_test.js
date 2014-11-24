module('lunr.Index')

test("defining what fields to index", function () {
  var idx = new lunr.Index
  idx.field('foo')

  deepEqual(idx._fields[0], {name: 'foo', boost: 1})
})

test("giving a particular field a weighting", function () {
  var idx = new lunr.Index
  idx.field('foo', { boost: 10 })

  deepEqual(idx._fields[0], {name: 'foo', boost: 10})
})

test('default reference should be id', function () {
  var idx = new lunr.Index
  equal(idx._ref, 'id')
})

test("defining the reference field for the index", function () {
  var idx = new lunr.Index
  idx.ref('foo')

  deepEqual(idx._ref, 'foo')
})

test('adding a document to the index', function () {
  var idx = new lunr.Index,
      doc = {id: 1, body: 'this is a test'}

  idx.field('body')
  idx.add(doc)

  equal(idx.documentStore.length, 1)
  ok(!!idx.documentStore.get(1))
})

test('adding a document with an empty field', function () {
  var idx = new lunr.Index,
      doc = {id: 1, body: 'test', title: ''}

  idx.field('title')
  idx.field('body')

  idx.add(doc)
  ok(!isNaN(idx.tokenStore.get('test')[1].tf))
})

test('triggering add events', function () {
  var idx = new lunr.Index,
      doc = {id: 1, body: 'this is a test'},
      callbackCalled = false,
      callbackArgs = []

  idx.on('add', function (doc, index) {
    callbackCalled = true
    callbackArgs = Array.prototype.slice.call(arguments)
  })

  idx.field('body')
  idx.add(doc)

  ok(callbackCalled)
  equal(callbackArgs.length, 2)
  deepEqual(callbackArgs[0], doc)
  deepEqual(callbackArgs[1], idx)
})

test('silencing add events', function () {
  var idx = new lunr.Index,
      doc = {id: 1, body: 'this is a test'},
      callbackCalled = false,
      callbackArgs = []

  idx.on('add', function (doc, index) {
    callbackCalled = true
    callbackArgs = Array.prototype.slice.call(arguments)
  })

  idx.field('body')
  idx.add(doc, false)

  ok(!callbackCalled)
})

test('removing a document from the index', function () {
  var idx = new lunr.Index,
      doc = {id: 1, body: 'this is a test'}

  idx.field('body')
  equal(idx.documentStore.length, 0)

  idx.add(doc)
  equal(idx.documentStore.length, 1)

  idx.remove(doc)
  equal(idx.documentStore.length, 0)
})

test('triggering remove events', function () {
  var idx = new lunr.Index,
      doc = {id: 1, body: 'this is a test'},
      callbackCalled = false,
      callbackArgs = []

  idx.on('remove', function (doc, index) {
    callbackCalled = true
    callbackArgs = Array.prototype.slice.call(arguments)
  })

  idx.field('body')
  idx.add(doc)
  idx.remove(doc)

  ok(callbackCalled)
  equal(callbackArgs.length, 2)
  deepEqual(callbackArgs[0], doc)
  deepEqual(callbackArgs[1], idx)
})

test('silencing remove events', function () {
  var idx = new lunr.Index,
      doc = {id: 1, body: 'this is a test'},
      callbackCalled = false,
      callbackArgs = []

  idx.on('remove', function (doc, index) {
    callbackCalled = true
    callbackArgs = Array.prototype.slice.call(arguments)
  })

  idx.field('body')
  idx.add(doc)
  idx.remove(doc, false)

  ok(!callbackCalled)
})

test('removing a non-existent document from the index', function () {
  var idx = new lunr.Index,
      doc = {id: 1, body: 'this is a test'},
      doc2 = {id: 2, body: 'i dont exist'},
      callbackCalled = false

  idx.on('remove', function (doc, index) {
    callbackCalled = true
  })

  idx.field('body')
  equal(idx.documentStore.length, 0)

  idx.add(doc)
  equal(idx.documentStore.length, 1)

  idx.remove(doc2)
  equal(idx.documentStore.length, 1)

  ok(!callbackCalled)
})

test('updating a document', function () {
  var idx = new lunr.Index,
      doc = {id: 1, body: 'foo'}

  idx.field('body')
  idx.add(doc)
  equal(idx.documentStore.length, 1)
  ok(idx.tokenStore.has('foo'))

  doc.body = 'bar'
  idx.update(doc)

  equal(idx.documentStore.length, 1)
  ok(idx.tokenStore.has('bar'))
})

test('emitting update events', function () {
  var idx = new lunr.Index,
      doc = {id: 1, body: 'foo'},
      addCallbackCalled = false,
      removeCallbackCalled = false,
      updateCallbackCalled = false,
      callbackArgs = []

  idx.field('body')
  idx.add(doc)
  equal(idx.documentStore.length, 1)
  ok(idx.tokenStore.has('foo'))

  idx.on('update', function (doc, index) {
    updateCallbackCalled = true
    callbackArgs = Array.prototype.slice.call(arguments)
  })

  idx.on('add', function () {
    addCallbackCalled = true
  })

  idx.on('remove', function () {
    removeCallbackCalled = true
  })


  doc.body = 'bar'
  idx.update(doc)

  ok(updateCallbackCalled)
  equal(callbackArgs.length, 2)
  deepEqual(callbackArgs[0], doc)
  deepEqual(callbackArgs[1], idx)

  ok(!addCallbackCalled)
  ok(!removeCallbackCalled)
})

test('silencing update events', function () {
  var idx = new lunr.Index,
      doc = {id: 1, body: 'foo'},
      callbackCalled = false

  idx.field('body')
  idx.add(doc)
  equal(idx.documentStore.length, 1)
  ok(idx.tokenStore.has('foo'))

  idx.on('update', function (doc, index) {
    callbackCalled = true
  })

  doc.body = 'bar'
  idx.update(doc, false)

  ok(!callbackCalled)
})

test('serialising', function () {
  var idx = new lunr.Index,
      mockDocumentStore = { toJSON: function () { return 'documentStore' }},
      mockTokenStore = { toJSON: function () { return 'tokenStore' }},
      mockCorpusTokens = { toJSON: function () { return 'corpusTokens' }},
      mockPipeline = { toJSON: function () { return 'pipeline' }}

  idx.documentStore = mockDocumentStore
  idx.tokenStore = mockTokenStore
  idx.corpusTokens = mockCorpusTokens
  idx.pipeline = mockPipeline

  idx.ref('id')

  idx.field('title', { boost: 10 })
  idx.field('body')

  deepEqual(idx.toJSON(), {
    version: '@VERSION', // this is what the lunr version is set to before being built
    fields: [
      { name: 'title', boost: 10 },
      { name: 'body', boost: 1 }
    ],
    ref: 'id',
    documentStore: 'documentStore',
    tokenStore: 'tokenStore',
    corpusTokens: 'corpusTokens',
    pipeline: 'pipeline'
  })
})

test('loading a serialised index', function () {
  var serialisedData = {
    version: '@VERSION', // this is what the lunr version is set to before being built
    fields: [
      { name: 'title', boost: 10 },
      { name: 'body', boost: 1 }
    ],
    ref: 'id',
    documentStore: { store: {}, length: 0 },
    tokenStore: { root: {}, length: 0 },
    corpusTokens: [],
    pipeline: ['stopWordFilter', 'stemmer']
  }

  var idx = lunr.Index.load(serialisedData)

  deepEqual(idx._fields, serialisedData.fields)
  equal(idx._ref, 'id')
})

test('idf cache with reserved words', function () {
  var idx = new lunr.Index

  var troublesomeTokens = [
    'constructor',
    '__proto__',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf'
  ]

  troublesomeTokens.forEach(function (token) {
    equal(typeof(idx.idf(token)), 'number', 'Using token: ' + token)
  })
})

test('using a plugin', function () {
  var idx = new lunr.Index,
      ctx, args,
      plugin = function () {
        ctx = this
        args = Array.prototype.slice.call(arguments)
        this.pluginLoaded = true
      }

  idx.use(plugin, 'foo', 'bar')

  equal(ctx, idx)
  deepEqual(args, [idx, 'foo', 'bar'])
  ok(idx.pluginLoaded)
})
