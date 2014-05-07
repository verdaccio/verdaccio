var lunr = require('lunr')
  , localList = require('./local-list');

var Search = function() {
	this.index = lunr(function () {
		this.field('name', {boost: 10});
		this.field('description');
		this.field('author');
	});

	this.id = 0;

	var packages = storage.get_local()
	  , i = packages.length;

	while(i--) {
		this.index(packages[i]);
	}
};

Search.prototype = {
	query: function(q) {
		return index.search(q);
	},
	index: function(package) {
		this.index.add({
			id:           ++this.id,
			title:        package.name,
			description:  package.description,
			author:       package._npmUser.name
		});
	}
};

module.exports = new Search();