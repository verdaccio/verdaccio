
var fs = require('fs');
var path = require('path');

function rmdirSync(dirpath){

	if(fs.existsSync(dirpath) && fs.statSync(dirpath).isDirectory()) {
		var files = fs.readdirSync(dirpath);
		files.forEach(function(file, index) {

			var curPath = path.join(dirpath, file);
			if(fs.statSync(curPath).isDirectory()) {
				rmdirSync(curPath);
			} else {
				console.log(curPath);
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(dirpath);
	}
}

module.exports = rmdirSync;