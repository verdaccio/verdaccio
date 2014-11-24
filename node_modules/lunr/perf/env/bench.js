(function () {

  var BenchView = function (benchmark) {
    this.benchmark = benchmark
    var benchmarkTemplate = $('#benchmark-template').text()
    this.html = $(Mustache.to_html(benchmarkTemplate, benchmark))

    this.benchmark.on('start', this.started.bind(this))
    this.benchmark.on('complete', this.completed.bind(this))
    this.benchmark.on('error', this.errored.bind(this))

    this.html.find('button').bind('click', function () {
      benchmark.run({async: true})
    })
  }

  BenchView.prototype.started = function () {
    this.html
      .addClass('is-running')
      .find('.status')
        .html('Running&hellip;')
  }

  BenchView.prototype.completed = function () {
    this.html
      .removeClass('is-running')
      .find('.status')
        .text('Done')
      .end()
      .find('.ops-per-sec')
        .text(Benchmark.formatNumber(this.benchmark.hz.toFixed(2)))
  }

  BenchView.prototype.errored = function () {
    this.html
      .removeClass('is-running')
      .addClass('is-errored')
      .find('.status')
        .text('Error')

   throw(this.benchmark.error)
  }

  benchmarks = []

  var bench = function (name, testFn, options) {
    var benchmark = new Benchmark(name, testFn, options)
    benchmarks.push(benchmark)
  }

  bench.runAll = function () {
    for (var i = 1; i < benchmarks.length; i++) {
      var benchmark = benchmarks[i],
          prev = benchmarks[i - 1]

      prev.on('complete', function () {
        console.log(benchmark)
        benchmark.run({async: true})
      })
    }

    benchmarks[0].run({async: true})
  }

  $(document).ready(function () {
    var benchmarksContainer = $('#benchmarks tbody')

    benchmarks.forEach(function (benchmark) {
      var benchView = new BenchView (benchmark)
      benchmarksContainer.append(benchView.html)
    })

    $('button.run').click(function () {
      //bench.runAll()
    })
  })

  window.bench = bench
})()
