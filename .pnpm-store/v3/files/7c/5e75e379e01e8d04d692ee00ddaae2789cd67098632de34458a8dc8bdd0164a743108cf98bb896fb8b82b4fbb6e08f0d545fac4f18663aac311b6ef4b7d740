"use strict";

var stringify = require('.');

var _require = require('string_decoder'),
    StringDecoder = _require.StringDecoder;

module.exports = function (records) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var data = [];

  if (Buffer.isBuffer(records)) {
    var decoder = new StringDecoder();
    records = decoder.write(records);
  }

  var stringifier = new stringify.Stringifier(options);

  stringifier.push = function (record) {
    if (record) {
      data.push(record.toString());
    }
  };

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = records[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var record = _step.value;
      stringifier.write(record);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  stringifier.end();
  return data.join('');
};