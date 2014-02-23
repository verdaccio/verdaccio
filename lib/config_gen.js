var fs = require('fs')
  , crypto = require('crypto')

module.exports = function create_config() {
	var pass = crypto.randomBytes(8).toString('base64').replace(/[=+\/]/g, '')
	  , pass_digest = crypto.createHash('sha1').update(pass).digest('hex')

	/*eslint no-sync:0*/
	var config = fs.readFileSync(require.resolve('./config_def.yaml'), 'utf8')

	config = config.replace('__PASSWORD__', pass_digest)

	return {
		yaml: config,
		user: 'admin',
		pass: pass,
	}
}

