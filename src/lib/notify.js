'use strict';

const Handlebars = require('handlebars');
const request = require('request');
const _ = require('lodash');
const logger = require('./logger');

const handleNotify = function(metadata, notifyEntry) {
  let regex;
  if (metadata.name && notifyEntry.packagePattern) {
    // FUTURE: comment out due https://github.com/verdaccio/verdaccio/pull/108#issuecomment-312421052
    // regex = new RegExp(notifyEntry.packagePattern, notifyEntry.packagePatternFlags || '');
    regex = new RegExp(notifyEntry.packagePattern);
    if (!regex.test(metadata.name)) {
      return;
    }
  }

  const template = Handlebars.compile(notifyEntry.content);
  const content = template( metadata );

  const options = {
    body: content,
  };

  // provides fallback support, it's accept an Object {} and Array of {}
  if (notifyEntry.headers && _.isArray(notifyEntry.headers)) {
    const header = {};
    notifyEntry.headers.map(function(item) {
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

  if ( notifyEntry.endpoint ) {
    options.url = notifyEntry.endpoint;
  }

  return new Promise(( resolve, reject) => {
    request(options, function(err, response, body) {
      if (err || response.statusCode >= 400) {
        const errorMessage = _.isNil(err) ? response.statusMessage : err;
        logger.logger.error({err: errorMessage}, ' notify error: @{err.message}' );
        reject(errorMessage);
      } else {
        logger.logger.info({content: content}, 'A notification has been shipped: @{content}');
        if (body) {
          logger.logger.debug({body: body}, ' body: @{body}' );
        }
        resolve(_.isNil(body) === false ? body : null);
      }
    });
  });
};

const notify = function(metadata, config) {
  if (config.notify) {
    if (config.notify.content) {
      return handleNotify(metadata, config.notify);
    } else {
      // multiple notifications endpoints PR #108
      return Promise.all(_.map(config.notify, (key) => handleNotify(metadata, key)));
    }
  }
};

module.exports.notify = notify;
