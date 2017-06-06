'use strict';

const Handlebars = require('handlebars');
const request = require('request');
const _ = require('lodash');
const logger = require('./logger');

const handleNotify = function(metadata, notifyEntry) {
  let regex;
  if (metadata.name && notifyEntry.packagePattern) {
    regex = new RegExp(notifyEntry.packagePattern, notifyEntry.packagePatternFlags || '');
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

  request(options, function(err, response, body) {
    if (err) {
      logger.logger.error({err: err}, ' notify error: @{err.message}' );
    } else {
      logger.logger.info({content: content}, 'A notification has been shipped: @{content}');
      if (body) {
        logger.logger.debug({body: body}, ' body: @{body}' );
      }
    }
  });
};

const notify = function(metadata, config) {
  if (config.notify) {
    if (config.notify.content) {
      handleNotify(metadata, config.notify);
    } else {
      for (const key in config.notify) {
        if (config.notify.hasOwnProperty(key)) {
          handleNotify(metadata, config.notify[key]);
        }
      }
    }
  }
};

module.exports.notify = notify;
