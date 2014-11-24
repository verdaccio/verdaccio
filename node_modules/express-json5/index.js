var getBody = require('raw-body')
  , http = require('http')
  , jju = require('jju')

module.exports = express_json5
module.exports.regexp = /^application\/([\w!#\$%&\*`\-\.\^~]*\+)?json5?$/i

function express_json5(options) {
	options = options || {}
	var strict = options.strict !== false
	var regexp = options.regexp || module.exports.regexp

	return function jsonParser(req, res, next) {
		if (req._body) return next()
		req.body = req.body || {}

		if (!hasBody(req)) return next()

		// check Content-Type
		if (!regexp.test(mime(req))) return next()

		// flag as parsed
		req._body = true;

		// parse
		getBody(req, {
			limit: options.limit || '100kb',
			length: req.headers['content-length'],
			encoding: 'utf8'
		}, function (err, buf) {
			if (err) return next(err)

			var first = buf.trim()[0]

			if (0 == buf.length) {
				return next(error(400, 'invalid json, empty body'))
			}

			try {
				// for performance reasons we try JSON.parse first
				req.body = JSON.parse(buf, options.reviver)
			} catch (_) {
				try {
					req.body = jju.parse(buf, options)
				} catch(err) {
					err.body = buf
					err.status = 400
					return next(err)
				}
			}
			if (strict && typeof(req.body) !== 'object') return next(error(400, 'invalid json'))
			next()
		})
	}
}

function hasBody(req) {
	var encoding = 'transfer-encoding' in req.headers
	var length = 'content-length' in req.headers && req.headers['content-length'] !== '0'
	return encoding || length
}

function mime(req) {
	var str = req.headers['content-type'] || ''
	  , i = str.indexOf(';')
	return ~i ? str.slice(0, i) : str
}

function error(code, msg) {
	var err = new Error(msg || http.STATUS_CODES[code])
	err.status = code
	return err
}

