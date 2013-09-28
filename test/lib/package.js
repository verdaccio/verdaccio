
module.exports = function(name) {
	return {
		"name": name,
		"version": "0.0.0",
		"dist": {
			"shasum": "fake",
			"tarball": "http://localhost:55551/"+escape(name)+"/-/blahblah"
		}
	};
}

