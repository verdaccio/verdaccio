
describe('config.yaml', function() {
  it('should be parseable', function() {
    var source = require('fs').readFileSync(__dirname + '/../../lib/config_def.yaml', 'utf8')
    require('js-yaml').safeLoad(source)
  })
})

