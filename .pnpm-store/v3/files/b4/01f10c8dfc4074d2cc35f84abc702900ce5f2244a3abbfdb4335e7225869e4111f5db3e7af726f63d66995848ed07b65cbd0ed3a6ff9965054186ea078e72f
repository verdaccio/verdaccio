var lunr = require('lunr');
var assert = require('chai').assert;
var lunrMutable = require('../lunr-mutable.js');

suite('mutable serialization', function () {
  setup(function () {
    var documents = [{
      id: 'a',
      title: 'Mr. Green kills Colonel Mustard',
      body: 'Mr. Green killed Colonel Mustard in the study with the candlestick. Mr. Green is not a very nice fellow.',
      wordCount: 19
    },{
      id: 'b',
      title: 'Plumb waters plant',
      body: 'Professor Plumb has a green plant in his study',
      wordCount: 9
    },{
      id: 'c',
      title: 'Scarlett helps Professor',
      body: 'Miss Scarlett watered Professor Plumbs green plant while he was away from his office last week.',
      wordCount: 16
    }]

    var builder = new lunrMutable.Builder

    builder.pipeline.add(
      lunr.trimmer,
      lunr.stopWordFilter,
      lunr.stemmer
    )

    builder.searchPipeline.add(
      lunr.stemmer
    )

    var config = function () {
      this.ref('id')
      this.field('title')
      this.field('body')

      documents.forEach(function (document) {
        this.add(document)
      }, this)
    }

    config.call(builder, builder)

    this.idx = builder.build()

    this.idx.add({
      id: 'd',
      title: 'Naom Chomsky',
      body: 'Colorless green ideas sleep furiously',
      wordCount: 5
    });

    this.serializedIdx = JSON.stringify(this.idx)
    this.loadedIdx = lunrMutable.Index.load(JSON.parse(this.serializedIdx))
  })

  test('loadedAddWorked', function () {
    this.loadedIdx.add({
      id: 'e',
      title: 'Naom Chomsky',
      body: 'Colorless green ideas sleep furiously I think',
      wordCount: 7
    });
    var results = this.loadedIdx.search('green')
    assert.equal('a', results[0].ref)
    assert.equal('b', results[1].ref)
    assert.equal('d', results[2].ref)
    assert.equal('e', results[3].ref)
    assert.equal('c', results[4].ref)
  })

  test('loadedRemoveWorked', function () {
    this.loadedIdx.remove({ id: 'b' });

    var results = this.loadedIdx.search('green')
    assert.equal('a', results[0].ref)
    assert.equal('d', results[1].ref)
    assert.equal('c', results[2].ref)
  })

  test('loadedUpdateWorked', function () {
    this.loadedIdx.update({
      id: 'd',
      title: 'Naom Chomsky',
      body: 'Et quo dolor velit iusto iure reprehenderit totam fugit Hic cumque distinctio consectetur suscipit qui itaque provident et Perspiciatis aut dolorum quia inventore hic Blanditiis error architecto vel et reprehenderit corporis sint Et sit modi non qui porro. Aut neque accusamus cumque nihil voluptates green',
      wordCount: 46
    });

    var results = this.loadedIdx.search('green')
    assert.equal('a', results[0].ref)
    assert.equal('b', results[1].ref)
    assert.equal('c', results[2].ref)
    assert.equal('d', results[3].ref)
  })
})
