var lunr = require('lunr')
  , localList = require('./local-list');

var Search = function() {
	this.index = lunr(function () {
		this.field('name',          {boost: 10});
		this.field('description',   {boost: 4});
		this.field('author',        {boost: 6});
		this.field('readme');
	});
};

Search.prototype = {
	query: function(q) {
		return this.index.search(q);
	},
	add: function(package) {
		var self = this;

		this.storage.get_readme(package.name, package.version, function(readme) {
			self.index.add({
				id:           package.name,
				name:         package.name,
				description:  package.description,
				author:       package._npmUser.name,
				readme:       readme
			});
		});
	},
	reindex: function() {
		var self = this;
		this.storage.get_local(function(err, packages) {
			var i = packages.length;

			while(i--) {
				self.add(packages[i]);
			}
		});
	},
	configureStorage: function(storage) {
		this.storage = storage;
		this.reindex();
	}
};

module.exports = new Search();