require([
  '/example/jquery.js',
  '/example/mustache.js',
  '../lunr.js',
  'text!templates/question_view.mustache',
  'text!templates/question_list.mustache',
  'text!example_data.json',
  'text!example_index.json'
], function (_, Mustache, lunr, questionView, questionList, data, indexDump) {

  var renderQuestionList = function (qs) {
    $("#question-list-container")
      .empty()
      .append(Mustache.to_html(questionList, {questions: qs}))
  }

  var renderQuestionView = function (question) {
    $("#question-view-container")
      .empty()
      .append(Mustache.to_html(questionView, question))
  }

  window.profile = function (term) {
    console.profile('search')
    idx.search(term)
    console.profileEnd('search')
  }

  window.search = function (term) {
    console.time('search')
    idx.search(term)
    console.timeEnd('search')
  }

  var indexDump = JSON.parse(indexDump)
  console.time('load')
  window.idx = lunr.Index.load(indexDump)
  console.timeEnd('load')

  var questions = JSON.parse(data).questions.map(function (raw) {
    return {
      id: raw.question_id,
      title: raw.title,
      body: raw.body,
      tags: raw.tags.join(' ')
    }
  })

  renderQuestionList(questions)
  renderQuestionView(questions[0])

  $('a.all').bind('click', function () {
    renderQuestionList(questions)
    $('input').val('')
  })

  var debounce = function (fn) {
    var timeout
    return function () {
      var args = Array.prototype.slice.call(arguments),
          ctx = this

      clearTimeout(timeout)
      timeout = setTimeout(function () {
        fn.apply(ctx, args)
      }, 100)
    }
  }

  $('input').bind('keyup', debounce(function () {
    if ($(this).val() < 2) return
    var query = $(this).val()
    var results = idx.search(query).map(function (result) {
      return questions.filter(function (q) { return q.id === parseInt(result.ref, 10) })[0]
    })

    renderQuestionList(results)
  }))

  $("#question-list-container").delegate('li', 'click', function () {
    var li = $(this)
    var id = li.data('question-id')

    renderQuestionView(questions.filter(function (question) {
      return (question.id == id)
    })[0])
  })

})
