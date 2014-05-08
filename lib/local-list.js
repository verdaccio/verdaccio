var fs = require('fs')
  , listFilePath = './local-list.json';

var LocalList = function() {
	if(fs.existsSync(listFilePath)) {
		this.list = JSON.parse(fs.readFileSync(listFilePath, 'utf8'));
	}
	else {
		this.list = [];
	}
};

LocalList.prototype = {
	add: function(name) {
		if(this.list.indexOf(name) == -1) {
			this.list.push(name);
			this.sync();
		}
	},
	remove: function() {
		var i = this.list.indexOf(name);
		if(i != -1) {
			this.list.splice(i, 1);
		}
		
		this.sync();
	},
	get: function() {
		return this.list;
	},
	sync: function() {
		fs.writeFileSync(listFilePath, JSON.stringify(this.list)); //Uses sync to prevent ugly race condition
	}
};

module.exports = new LocalList();
