var suite = new Benchmark.Suite,
    set = new lunr.SortedSet

for (var i = 0; i < 1000; i++) {
  set.add(Math.random() * 100)
};

suite.add('native indexOf', function () {
  set.elements.indexOf(50)
})

suite.add('bsearch indexOf', function () {
  set.indexOf(50)
})

suite.on('cycle', function (e) {
  console.log(e.target.name)
})

suite.on('complete', function (e) {
  suite.forEach(function (s) {
    console.log(s.name, s.count)
  })

  var fastest = this.filter('fastest').pluck('name')
  console.log('fastest is: ', fastest)
})

suite.run({async: true})
