module('lunr.tokenizer')

test("splitting simple strings into tokens", function () {
  var simpleString = "this is a simple string",
      tokens = lunr.tokenizer(simpleString)

  deepEqual(tokens, ['this', 'is', 'a', 'simple', 'string'])
})

test('downcasing tokens', function () {
  var simpleString = 'FOO BAR',
      tags = ['Foo', 'BAR']

  deepEqual(lunr.tokenizer(simpleString), ['foo', 'bar'])
  deepEqual(lunr.tokenizer(tags), ['foo', 'bar'])
})

test('handling arrays', function () {
  var tags = ['foo', 'bar'],
      tokens = lunr.tokenizer(tags)

  deepEqual(tokens, tags)
})

test('handling multiple white spaces', function () {
  var testString = '  foo    bar  ',
      tokens = lunr.tokenizer(testString)

  deepEqual(tokens, ['foo', 'bar'])
})

test('handling null-like arguments', function () {
  deepEqual(lunr.tokenizer(), [])
  deepEqual(lunr.tokenizer(null), [])
  deepEqual(lunr.tokenizer(undefined), [])
})

test('calling to string on passed val', function () {
  var date = new Date (Date.UTC(2013, 0, 1)),
      obj = {
        toString: function () { return 'custom object' }
      }

  equal(lunr.tokenizer(41), '41')
  equal(lunr.tokenizer(false), 'false')
  deepEqual(lunr.tokenizer(obj), ['custom', 'object'])

  // slicing here to avoid asserting on the timezone part of the date
  // that will be different whereever the test is run.
  deepEqual(lunr.tokenizer(date).slice(0, 4), ['tue', 'jan', '01', '2013'])
})

test("splitting strings with hyphens", function () {
  var simpleString = "take the New York-San Francisco flight",
      tokens = lunr.tokenizer(simpleString)

  deepEqual(tokens, ['take', 'the', 'new', 'york', 'san', 'francisco', 'flight'])
})

test("splitting strings with hyphens and spaces", function () {
  var simpleString = "Solve for A - B",
      tokens = lunr.tokenizer(simpleString)

  deepEqual(tokens, ['solve', 'for', 'a', 'b'])
})
