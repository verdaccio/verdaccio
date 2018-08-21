'use strict';

// see https://secure.flickr.com/photos/girliemac/sets/72157628409467125

const images = {
  100: 'aVvDhR', // '6512768893', // 100 - Continue
  101: 'aXXExP', // '6540479029', // 101 - Switching Protocols
  200: 'aVuVsF', // '6512628175', // 200 - OK
  201: 'aXWm1Z', // '6540221577', // 201 - Created
  202: 'aXXEyF', // '6540479079', // 202 - Accepted
  204: 'aYyJ7B', // '6547319943', // 204 - No Content
  206: 'aVEnUP', // '6514473163', // 206 - Partial Content
  207: 'aVEnRD', // '6514472979', // 207 - Multi-Status
  300: 'aW7mac', // '6519540181', // 300 - Multiple Choices
  301: 'aW7mb4', // '6519540231', // 301 - Moved Permanently
  302: 'aV6jKp', // '6508023829', // 302 - Found
  303: 'aVxtaK', // '6513125065', // 303 - See Other
  304: 'aXY3dH', // '6540551929', // 304 - Not Modified
  305: 'aXX5LK', // '6540365403', // 305 - Use Proxy
  307: 'aVwQnk', // '6513001269', // 307 - Temporary Redirect
  400: 'aXYDeT', // '6540669737', // 400 - Bad Request
  401: 'aV6jwe', // '6508023065', // 401 - Unauthorized
  402: 'aVwQoe', // '6513001321', // 402 - Payment Required
  403: 'aV6jFK', // '6508023617', // 403 - Forbidden
  404: 'aV6juR', // '6508022985', // 404 - Not Found
  405: 'aV6jE8', // '6508023523', // 405 - Method Not Allowed
  406: 'aV6jxa', // '6508023119', // 406 - Not Acceptable
  408: 'aV6jyc', // '6508023179', // 408 - Request Timeout
  409: 'aV6jzz', // '6508023259', // 409 - Conflict
  410: 'aVES2H', // '6514567755', // 410 - Gone
  411: 'aXYVpT', // '6540724141', // 411 - Length Required
  413: 'aV6jHZ', // '6508023747', // 413 - Request Entity Too Large
  414: 'aV6jBa', // '6508023351', // 414 - Request-URI Too Long
  416: 'aVxQvr', // '6513196851', // 416 - Requested Range Not Satisfiable
  417: 'aV6jGP', // '6508023679', // 417 - Expectation Failed
  418: 'aV6J7c', // '6508102407', // 418 - I'm a teapot
  422: 'aVEnTt', // '6514473085', // 422 - Unprocessable Entity
  423: 'aVEyVZ', // '6514510235', // 423 - Locked
  424: 'aVEWZ6', // '6514584423', // 424 - Failed Dependency
  425: 'aXYdzH', // '6540586787', // 425 - Unordered Collection
  426: 'aVdo4M', // '6509400771', // 426 - Upgrade Required
  429: 'aVdo8F', // '6509400997', // 429 - Too Many Requests
  431: 'aVdo3n', // '6509400689', // 431 - Request Header Fields Too Large
  444: 'aVdo1P', // '6509400599', // 444 - No Response
  450: 'aVxtbK', // '6513125123', // 450 - Blocked by Windows Parental Controls
  451: 'eTiGQd', // '9113233540', // 451 - Unavailable for Legal Reasons
  500: 'aVdo6e', // '6509400855', // 500 - Internal Server Error
  502: 'aV6jCv', // '6508023429', // 502 - Bad Gateway
  503: 'aXYvop', // '6540643319', // 503 - Service Unavailable
  506: 'aXYvnH', // '6540643279', // 506 - Variant Also Negotiates
  507: 'aVdnZa', // '6509400503', // 507 - Insufficient Storage
  508: 'aVdnYa', // '6509400445', // 508 - Loop Detected
  509: 'aXXg1V', // '6540399865', // 509 - Bandwidth Limit Exceeded
  599: 'aVdo7v' // '6509400929', // 599 - Network connect timeout error
};

module.exports.get_image = function (status) {
  if (status in images) {
    return 'http://flic.kr/p/' + images[status];
    // return 'https://secure.flickr.com/photos/girliemac/'+images[status]+'/in/set-72157628409467125/lightbox/'
  }
};

module.exports.middleware = function (req, res, next) {
  let _writeHead = res.writeHead;
  res.writeHead = function (status) {
    if (status in images) {
      res.setHeader('X-Status-Cat', module.exports.get_image(status));
    }
    /* eslint prefer-rest-params: "off" */
    _writeHead.apply(res, arguments);
  };

  next();
};