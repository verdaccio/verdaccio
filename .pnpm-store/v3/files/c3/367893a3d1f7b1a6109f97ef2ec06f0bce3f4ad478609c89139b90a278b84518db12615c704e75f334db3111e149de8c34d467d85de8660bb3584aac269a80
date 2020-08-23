var assert = require('chai').assert;
var lunrMutable = require('../lunr-mutable.js');

suite('mutable indexes', function () {
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

    this.idx = lunrMutable(function () {
       this.field('title')
       this.field('body')
       this.ref('id')

       documents.forEach(function (document) {
         this.add(document)
       }, this)
    })

    this.idx.add({
      id: 'd',
      title: 'Naom Chomsky',
      body: 'Colorless green ideas sleep furiously',
      wordCount: 5
    });
  })

  test('addWorked', function () {
    var results = this.idx.search('green')
    assert.equal('a', results[0].ref)
    assert.equal('b', results[1].ref)
    assert.equal('d', results[2].ref)
    assert.equal('c', results[3].ref)
  })

  test('removeWorked', function () {
    this.idx.remove({ id: 'b' });

    var results = this.idx.search('green')
    assert.equal('a', results[0].ref)
    assert.equal('d', results[1].ref)
    assert.equal('c', results[2].ref)
  })

  test('updateWorked', function () {
    this.idx.update({
      id: 'd',
      title: 'Naom Chomsky',
      body: 'Et quo dolor velit iusto iure reprehenderit totam fugit Hic cumque distinctio consectetur suscipit qui itaque provident et Perspiciatis aut dolorum quia inventore hic Blanditiis error architecto vel et reprehenderit corporis sint Et sit modi non qui porro. Aut neque accusamus cumque nihil voluptates green',
      wordCount: 46
    });

    var results = this.idx.search('green')
    assert.equal('a', results[0].ref)
    assert.equal('b', results[1].ref)
    assert.equal('c', results[2].ref)
    assert.equal('d', results[3].ref)
  })
})
