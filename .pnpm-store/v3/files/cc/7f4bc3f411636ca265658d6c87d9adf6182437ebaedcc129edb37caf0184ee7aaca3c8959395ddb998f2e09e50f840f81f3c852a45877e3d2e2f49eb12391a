var lunr = require('lunr')
var assert = require('chai').assert
var lunrMutable = require('../lunr-mutable.js')

suite('mutable scoring', function () {
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

  function setupBuilder(lunrModule) {
    let builder = new lunrModule.Builder()

    builder.pipeline.add(
      lunr.trimmer,
      lunr.stopWordFilter,
      lunr.stemmer
    )

    builder.searchPipeline.add(
      lunr.stemmer
    )

    builder.ref('id')
    builder.field('body')

    return builder
  }

  test("redundant removal doesn't affect scoring", function () {
    let immutableBuilder = setupBuilder(lunr)
    let mutableBuilder = setupBuilder(lunrMutable)

    for(let document of documents) {
      immutableBuilder.add(document)

      mutableBuilder.remove(document)
      mutableBuilder.add(document)
    }

    let immutableIndex = immutableBuilder.build()
    let mutableIndex = mutableBuilder.build()

    let immutableResults = immutableIndex.search('green')
    let mutableResults = mutableIndex.search('green')

    assert.equal(immutableResults[0].score, mutableResults[0].score)
  })

  test("repeated removal + add in builder doesn't affect scoring", function () {
    let onceBuilder = setupBuilder(lunrMutable)
    let twiceBuilder = setupBuilder(lunrMutable)

    for(let document of documents) {
      onceBuilder.add(document)

      twiceBuilder.add(document)
      twiceBuilder.remove(document)
      twiceBuilder.add(document)
    }

    let onceIndex = onceBuilder.build()
    let twiceIndex = twiceBuilder.build()

    let onceResults = onceIndex.search('green')
    let twiceResults = twiceIndex.search('green')

    assert.equal(onceResults[0].score, twiceResults[0].score)
  })
})
