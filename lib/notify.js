'use strict';

let Handlebars = require('handlebars');
let request = require('request');
let Logger = require('./logger');

module.exports.notify = function(metadata, config) {
  if (config.notify && config.notify.content) {
    let template = Handlebars.compile(config.notify.content);
    let content = template( metadata );

    let options = {
      body: content,
    };

    // provides fallback support, it's accept an Object {} and Array of {}
    if ( config.notify.headers && Array.isArray(config.notify.headers) ) {
      let header = {};
      config.notify.headers.map(function(item) {
        if (Object.is(item, item)) {
          for (let key in item) {
            header[key] = item[key];
          }
        }
      });
      options.headers = header;
    } else if (Object.is(config.notify.headers, config.notify.headers)) {
      options.headers = config.notify.headers;
    }

    options.method = config.notify.method;

    if (config.notify.endpoint) {
      options.url = config.notify.endpoint;
    }

    request(options, function(err, response, body) {
      if (err) {
        Logger.logger.error( {err: err}, ' notify error: @{err.message}' );
      } else {
        Logger.logger.info({content: content}, 'A notification has been shipped: @{content}');
        if (body) {
          Logger.logger.debug( {body: body}, ' body: @{body}' );
        }
      }
    });
  }
};
