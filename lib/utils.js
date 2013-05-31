var assert = require('assert');

// from normalize-package-data/lib/fixer.js
module.exports.validate_name = function(name) {
	if (
		name.charAt(0) === "." ||
		name.match(/[\/@\s\+%:]/) ||
		name !== encodeURIComponent(name) ||
		name.toLowerCase() === "node_modules" ||
		name.toLowerCase() === "favicon.ico"
	) {
		return false;
	} else {
		return true;
	}
}

function is_object(obj) {
	return typeof(obj) === 'object' && !Array.isArray(obj);
}

module.exports.validate_metadata = function(object, name) {
	assert(is_object(object));
	assert.equal(object._id, name);
	assert.equal(object.name, name);
	
	if (!is_object(object['dist-tags'])) {
		object['dist-tags'] = {};
	}
	
	if (!is_object(object['versions'])) {
		object['versions'] = {};
	}
	
	return object;
}

