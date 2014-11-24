(function () {

  var setup = function () {
    var store = new lunr.Store,
        tokens = ['foo', 'bar', 'baz']

  }

  bench('documentStore#set', function () {
    for (var i = 0; i < 1000; i++) {
      store.set(i, tokens)
    }
  }, { setup: setup })

})()

