
describe('config.yaml', function() {
  it('should be parseable', function() {
	var fname = __dirname + '/../../conf/default.yaml';
	console.log("config: "+fname);
    var source = require('fs').readFileSync(fname, 'utf8')
    require('js-yaml').safeLoad(source)
  })
})

