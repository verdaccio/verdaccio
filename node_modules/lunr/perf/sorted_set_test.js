(function () {
  var setup = function () {
    var filledSet = new lunr.SortedSet
    for (var i = 0; i < 10000; i++) {
      filledSet.add(i * 2)
    }
  }

  bench('sortedSet#add non-duplicate', function () {
    var sortedSet = new lunr.SortedSet
    sortedSet.elements = filledSet.elements
    sortedSet.add(3131)
  }, { setup: setup })

  bench('sortedSet#add duplicate', function () {
    var sortedSet = new lunr.SortedSet
    sortedSet.elements = filledSet.elements
    sortedSet.add(2000)
  }, { setup: setup })

})()

