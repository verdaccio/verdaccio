var Crypto = require('crypto')
var fs     = require('fs')

module.exports = function create_config() {
  var pass = Crypto.randomBytes(8).toString('base64').replace(/[=+\/]/g, '')
  var pass_digest = Crypto.createHash('sha1').update(pass).digest('hex')

  /*eslint no-sync:0*/
  var config = fs.readFileSync(require.resolve('./config_def.yaml'), 'utf8')

  config = config.replace('__PASSWORD__', pass_digest)

  return {
    yaml: config,
    user: 'admin',
    pass: pass,
  }
}

