"use strict";

var parse = require('.');

module.exports = function (data) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (typeof data === 'string') {
    data = Buffer.from(data);
  }

  var records = options && options.objname ? {} : [];
  var parser = new parse.Parser(options);

  parser.push = function (record) {
    if (record === null) {
      return;
    }

    if (options.objname === undefined) records.push(record);else {
      records[record[0]] = record[1];
    }
  };

  var err1 = parser.__parse(data, false);

  if (err1 !== undefined) throw err1;

  var err2 = parser.__parse(undefined, true);

  if (err2 !== undefined) throw err2;
  return records;
};