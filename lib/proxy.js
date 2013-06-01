var https = require('https');

module.exports.request = function(req, resp) {
	https.get({
		host: 'registry.npmjs.org',
		path: req.url,
		ca: require('./npmsslkeys'),
		headers: {
			'User-Agent': 'npmrepod/0.0.0',
		},
	}, function(res) {
		resp.writeHead(res.statusCode, res.headers);
		res.on('data', function(d) {
			resp.write(d);
		});
		res.on('end', function() {
			resp.end();
		});
	}).on('error', function(err) {
		console.error(err);
		resp.send(500);
	});
}

