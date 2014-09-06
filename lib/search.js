var lunr = require('lunr')

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
		this.index.add({
			id:           package.name,
			name:         package.name,
			description:  package.description,
			author:       package._npmUser ? package._npmUser.name : '???'
		});
	},
	remove: function(name) {
		this.index.remove({
			id: name
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
