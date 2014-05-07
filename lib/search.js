var lunr = require('lunr')
  , localList = require('./local-list');

var Search = function(storage) {
	this.storage = storage;

	this.index = lunr(function () {
		this.field('name', {boost: 10});
		this.field('description');
		this.field('author');
	});

	this.reindex();
};

Search.prototype = {
	query: function(q) {
		return this.index.search(q);
	},
	add: function(package) {
		this.index.add({
			id:           package.name,
			name:         package.name,
			description:  package.description,
			author:       package._npmUser.name
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
	}
};

module.exports = Search;