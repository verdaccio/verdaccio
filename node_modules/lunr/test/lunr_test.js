module('lunr')

test('returns a new instance of lunr.Index', function () {
  var index = lunr()

  equal(index.constructor, lunr.Index)
})

test('should set up the pipeline', function () {
  var index = lunr(),
      stack = index.pipeline._stack

  equal(stack.length, 3)
  equal(stack.indexOf(lunr.trimmer), 0)
  equal(stack.indexOf(lunr.stopWordFilter), 1)
  equal(stack.indexOf(lunr.stemmer), 2)
})

test('passing a config fn which is called with the new index', function () {
  var configCtx, configArg

  var index = lunr(function (idx) {
    configCtx = this
    configArg = idx

    this.ref('cid')

    this.field('title', 10)
    this.field('body')
  })

  equal(configCtx, index)
  equal(configArg, index)

  equal(index._ref, 'cid')
  equal(index._fields.length, 2)
})
