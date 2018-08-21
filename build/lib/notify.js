'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notify = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const handleNotify = function (metadata, notifyEntry, publisherInfo, publishedPackage) {
  let regex;
  if (metadata.name && notifyEntry.packagePattern) {
    // FUTURE: comment out due https://github.com/verdaccio/verdaccio/pull/108#issuecomment-312421052
    // regex = new RegExp(notifyEntry.packagePattern, notifyEntry.packagePatternFlags || '');
    regex = new RegExp(notifyEntry.packagePattern);
    if (!regex.test(metadata.name)) {
      return;
    }
  }

  const template = _handlebars2.default.compile(notifyEntry.content);

  // don't override 'publisher' if package.json already has that
  if (!metadata.publisher) {
    metadata = _extends({}, metadata, { publishedPackage, publisher: publisherInfo });
  }
  const content = template(metadata);

  const options = {
    body: content
  };

  // provides fallback support, it's accept an Object {} and Array of {}
  if (notifyEntry.headers && _lodash2.default.isArray(notifyEntry.headers)) {
    const header = {};
    notifyEntry.headers.map(function (item) {
      if (Object.is(item, item)) {
        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            header[key] = item[key];
          }
        }
      }
    });
    options.headers = header;
  } else if (Object.is(notifyEntry.headers, notifyEntry.headers)) {
    options.headers = notifyEntry.headers;
  }

  options.method = notifyEntry.method;

  if (notifyEntry.endpoint) {
    options.url = notifyEntry.endpoint;
  }

  return new Promise((resolve, reject) => {
    (0, _request2.default)(options, function (err, response, body) {
      if (err || response.statusCode >= 400) {
        const errorMessage = _lodash2.default.isNil(err) ? response.body : err.message;
        _logger2.default.logger.error({ errorMessage }, 'notify service has thrown an error: @{errorMessage}');

        reject(errorMessage);
      } else {
        _logger2.default.logger.info({ content }, 'A notification has been shipped: @{content}');
        if (_lodash2.default.isNil(body) === false) {
          const bodyResolved = _lodash2.default.isNil(body) === false ? body : null;

          _logger2.default.logger.debug({ body }, ' body: @{body}');
          return resolve(bodyResolved);
        }

        reject(Error('body is missing'));
      }
    });
  });
};

function sendNotification(metadata, key, ...moreMedatata) {
  return handleNotify(metadata, key, ...moreMedatata);
}

const notify = function (metadata, config, ...moreMedatata) {
  if (config.notify) {
    if (config.notify.content) {
      return sendNotification(metadata, config.notify, ...moreMedatata);
    } else {
      // multiple notifications endpoints PR #108
      return Promise.all(_lodash2.default.map(config.notify, key => sendNotification(metadata, key, ...moreMedatata)));
    }
  }

  return Promise.resolve();
};

exports.notify = notify;