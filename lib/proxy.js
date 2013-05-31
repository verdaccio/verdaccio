var http = require('http');

module.exports.request = function(req, resp) {
	console.log(req.headers);
	http.get({
		host: 'registry.npmjs.org',
		path: req.url,
		headers: {
			'User-Agent': 'npmrepod/0.0.0',
			'Authorization': req.headers.authorization,
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

