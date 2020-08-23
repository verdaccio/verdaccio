'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Wcwidth = require('wcwidth');
module.exports = function (word, breakAtLength) {
	var charArr = [].concat(_toConsumableArray(word));
	var index = 0;
	var indexOfLastFitChar = 0;
	var fittableLength = 0;
	while (charArr.length > 0) {
		var char = charArr.shift();
		var currentLength = fittableLength + Wcwidth(char);
		if (currentLength <= breakAtLength) {
			indexOfLastFitChar = index;
			fittableLength = currentLength;
			index++;
		} else {
			break;
		}
	}
	//break after this character
	return indexOfLastFitChar;
};
//# sourceMappingURL=index.js.map
