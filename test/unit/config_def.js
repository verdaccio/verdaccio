
describe('config.yaml', function() {
  it('should be parseable', function() {
    var source = require('fs').readFileSync(__dirname + '/../../conf/default.yaml', 'utf8')
    require('js-yaml').safeLoad(source)
  })
})

