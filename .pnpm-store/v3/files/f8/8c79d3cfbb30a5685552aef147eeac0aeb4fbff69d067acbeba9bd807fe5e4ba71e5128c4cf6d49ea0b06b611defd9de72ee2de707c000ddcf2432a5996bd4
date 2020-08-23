var lunr = require('lunr')
var assert = require('chai').assert

suite('assumptions about lunr internals', function () {
  test('builder has the keys we expect, and only those', function() {
    var builder = new lunr.Builder()
    var builder_keys = Object.keys(builder)

    const EXPECTED_FIELDS = [
      '_ref',
      '_fields',
      '_documents',
      'invertedIndex',
      'fieldTermFrequencies',
      'fieldLengths',
      'tokenizer',
      'pipeline',
      'searchPipeline',
      'documentCount',
      '_b',
      '_k1',
      'termIndex',
      'metadataWhitelist' ]

    assert.deepEqual(EXPECTED_FIELDS, builder_keys)
  })

  // XXX test index internals, too? plus index *methods*, since we need to check if things are dirty?

  test('Builder._fields is an Object', function () {
    var builder = new lunr.Builder()

    assert.typeOf(builder._fields, 'object')
    assert.isNotArray(builder._fields)
  })

  test("Index doesn't have any new methods", function () {
    const EXPECTED_METHODS = [ 'search', 'query', 'toJSON' ];
    var index_methods = Object.keys(lunr.Index.prototype)

    assert.deepEqual(EXPECTED_METHODS, index_methods);
  })
})
