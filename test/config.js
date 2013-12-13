var assert = require('assert')
  , ex = module.exports

ex['trying to fetch non-existent package'] = function(cb) {
	var f = fork('../bin/sinopia', ['-c', './config/log-1.yaml'], {silent: true})
	f.on('message', function(msg) {
		if ('sinopia_started' in msg) {
			f.kill()
			cb()
		}
	})
}

