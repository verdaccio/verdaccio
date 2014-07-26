var fs = require('fs')
  , crypto = require('crypto')
  , usersPath = './users.json';

var Users = function() {
	if(fs.existsSync(usersPath)) {
		this.users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
	}
	else {
		this.users = {};
	}
};

Users.prototype = {
	add: function(params, callback) {
		//Hash the Password
		if(params.password) {
			params.password = crypto.createHash('sha1').update(params.password).digest('hex');
		}
		else if(params.password_sha) {
			params.password = params.password_sha;
		}

		//Save
		this.users[params.name] = params;
		this.sync(callback);
	},
	remove: function(name, callback) {
		delete this.users[name];
		this.sync(callback);
	},
	sync: function(callback) {
		fs.writeFile(usersPath, JSON.stringify(this.users), callback);
	}
};

module.exports = new Users();
