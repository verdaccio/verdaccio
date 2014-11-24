module('lunr.stemmer')

test('should stem words correctly', function () {
  Object.keys(stemmingFixture).forEach(function (testWord) {
    var expected = stemmingFixture[testWord]

    equal(lunr.stemmer(testWord), expected)
  })
})

test('should be registered with lunr.Pipeline', function () {
  equal(lunr.stemmer.label, 'stemmer')
  deepEqual(lunr.Pipeline.registeredFunctions['stemmer'], lunr.stemmer)
})
