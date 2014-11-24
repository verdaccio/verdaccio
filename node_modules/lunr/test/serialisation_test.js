module('serialisation', {
  setup: function () {
    this.corpus = [{
      id: 'a',
      title: 'Mr. Green kills Colonel Mustard',
      body: 'Mr. Green killed Colonel Mustard in the study with the candlestick. Mr. Green is not a very nice fellow.'
    },{
      id: 'b',
      title: 'Plumb waters plant',
      body: 'Professor Plumb has a green plant in his study'
    },{
      id: 'c',
      title: 'Scarlett helps Professor',
      body: 'Miss Scarlett watered Professor Plumbs green plant while he was away from his office last week.'
    }]
  }
})

test('dumping and loading an index', function () {
  var idx = new lunr.Index

  idx.field('title', { boost: 10 })
  idx.field('body')

  this.corpus.forEach(function (doc) { idx.add(doc) })

  var dumpedIdx = JSON.stringify(idx),
      clonedIdx = lunr.Index.load(JSON.parse(dumpedIdx))

  deepEqual(idx.search('green plant'), clonedIdx.search('green plant'))
})

test('dumping and loading an index with a populated pipeline', function () {
  var idx = lunr(function () {
    this.field('title', { boost: 10 })
    this.field('body')
  })

  this.corpus.forEach(function (doc) { idx.add(doc) })

  var dumpedIdx = JSON.stringify(idx),
      clonedIdx = lunr.Index.load(JSON.parse(dumpedIdx))

  deepEqual(idx.pipeline._stack, clonedIdx.pipeline._stack)
  deepEqual(idx.search('water'), clonedIdx.search('water'))
})
