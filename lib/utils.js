
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

