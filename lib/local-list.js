var fs = require('fs')

function LocalList(path) {
	var self = Object.create(LocalList.prototype)
	self.path = path
	try {
		self.list = JSON.parse(fs.readFileSync(self.path, 'utf8')).list
	} catch(_) {
		self.list = []
	}
	return self
}

LocalList.prototype = {
	add: function(name) {
		if (this.list.indexOf(name) === -1) {
			this.list.push(name)
			this.sync()
		}
	},
	remove: function(name) {
		var i = this.list.indexOf(name)
		if (i !== -1) {
			this.list.splice(i, 1)
		}
		
		this.sync()
	},
	get: function() {
		return this.list
	},
	sync: function() {
		fs.writeFileSync(this.path, JSON.stringify({list: this.list})); //Uses sync to prevent ugly race condition
	},
}

module.exports = LocalList

