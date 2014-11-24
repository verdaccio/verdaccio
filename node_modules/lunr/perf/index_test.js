(function () {
  var setup = function () {
    var testDoc = {
      id: 1,
      title: 'Adding story from last story in the sprint',
      body: 'So that I am not confused where the story is going to end up As a user I want the the add a story button from the last story in the sprint to create a story at the top of the backlog and not extend the sprint temporarily the add story button inserts a story at the top of the backlog. "add a new story here" prompts are not shown for stories that are currently in a sprint',
      tags: 'foo bar'
    }

    questionsIdx.version = lunr.version

    var idx = lunr.Index.load(questionsIdx)
  }

  bench('index#add', function () {
    idx.add(testDoc)
  }, { setup: setup })

  bench('index#search uncommon word', function () {
    idx.search('checkbox')
  }, { setup: setup })

  bench('index#search common word', function () {
    idx.search('javascript')
  }, { setup: setup })

})()

