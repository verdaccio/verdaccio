module('lunr.trimmer')

test('latin characters', function () {
  var token = 'hello'
  equal(lunr.trimmer(token), token)
})

test('removing leading and trailing punctuation', function () {
  var fullStop = 'hello.',
      innerApostrophe = "it's",
      trailingApostrophe = "james'",
      exclamationMark = 'stop!',
      comma = 'first,',
      brackets = '[tag]'

  deepEqual(lunr.trimmer(fullStop), 'hello')
  deepEqual(lunr.trimmer(innerApostrophe), "it's")
  deepEqual(lunr.trimmer(trailingApostrophe), "james")
  deepEqual(lunr.trimmer(exclamationMark), 'stop')
  deepEqual(lunr.trimmer(comma), 'first')
  deepEqual(lunr.trimmer(brackets), 'tag')
})

test('should be registered with lunr.Pipeline', function () {
  equal(lunr.trimmer.label, 'trimmer')
  deepEqual(lunr.Pipeline.registeredFunctions['trimmer'], lunr.trimmer)
})
