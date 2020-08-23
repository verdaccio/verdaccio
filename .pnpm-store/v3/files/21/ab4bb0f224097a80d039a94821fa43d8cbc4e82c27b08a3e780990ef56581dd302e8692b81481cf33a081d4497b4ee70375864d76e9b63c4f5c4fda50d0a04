'use strict';
module.exports = function (obj, modifier) {
	var key;
	var val;
	var ret = {};
	var keys = Object.keys(Object(obj));

	for (var i = 0; i < keys.length; i++) {
		key = keys[i];
		val = obj[key];
		ret[key] = modifier(val, key);
	}

	return ret;
};
