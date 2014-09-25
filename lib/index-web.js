var fs = require('fs')
var marked = require('marked')
var search = require('./search')
var Handlebars = require('handlebars')
var Error = require('http-errors')

module.exports = function(app, config, storage) {
	search.configureStorage(storage)

	Handlebars.registerPartial('entry', fs.readFileSync(require.resolve('./GUI/entry.hbs'), 'utf8'));
	var template = Handlebars.compile(fs.readFileSync(require.resolve('./GUI/index.hbs'), 'utf8'));

	app.get('/', function(req, res, next) {
		res.setHeader('Content-Type', 'text/html');

		storage.get_local(function(err, packages) {
			res.send(template({
				name:       config.web.title || "Sinopia",
				packages:   packages,
				baseUrl:    config.url_prefix || req.protocol + '://' + req.get('host') + '/'
			}));
		});
	});

	// Static
	app.get('/-/static/:filename', function(req, res, next) {
		var file = __dirname + '/static/' + req.params.filename
		fs.exists(file, function(exists) {
			if (exists) {
				res.sendfile(file)
			} else {
				res.status(404);
				res.send("File Not Found")
			}
		})
	})

	app.get('/-/logo', function(req, res, next) {
		res.sendfile(config.web.logo ? config.web.logo : __dirname + "/static/logo.png")
	})

	// Search
	app.get('/-/search/:anything', function(req, res, next) {
		var results = search.query(req.params.anything),
			packages = []

		var getData = function(i) {
			storage.get_package(results[i].ref, function(err, entry) {
				if (entry) {
					packages.push(entry.versions[entry['dist-tags'].latest])
				}

				if (i >= results.length - 1) {
					res.send(packages)
				} else {
					getData(i + 1)
				}
			})
		}

		if (results.length) {
			getData(0);
		} else {
			res.send([])
		}
	})

	// Readme
	marked.setOptions({
		highlight: function (code) {
			return require('highlight.js').highlightAuto(code).value
		}
	})

	app.get('/-/readme/:package/:version?', function(req, res, next) {
		storage.get_package(req.params.package, {req: req}, function(err, info) {
			if (err) return next(err)
			res.send(marked(info.readme || 'ERROR: No README data found!'))
		})
	})
}

