"use strict";

module.exports = function (res, fn) {
  res.text = '';
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    res.text += chunk;
  });
  res.on('end', function () {
    var body;
    var err;

    try {
      body = res.text && JSON.parse(res.text);
    } catch (err2) {
      err = err2; // issue #675: return the raw response if the response parsing fails

      err.rawResponse = res.text || null; // issue #876: return the http status code if the response parsing fails

      err.statusCode = res.statusCode;
    } finally {
      fn(err, body);
    }
  });
};