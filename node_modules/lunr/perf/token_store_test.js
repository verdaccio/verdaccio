(function () {
  var setup = function () {
    questionsIdx.version = lunr.version

    var store = lunr.TokenStore.load(questionsIdx.tokenStore)
  }

  bench('tokenStore#getNode', function () {
    store.getNode('javascript')
  }, { setup: setup })

  bench('tokenStore#has non existant term', function () {
    store.has('qwertyuiop')
  }, { setup: setup })

  bench('tokenStore#has term exists', function () {
    store.has('javascript')
  }, { setup: setup })

})()

