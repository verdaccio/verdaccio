var Handlebars    = require('handlebars')
var request       = require('request')
var Logger        = require('./logger')

module.exports.notify = function(metadata, config) {

  if (config.notify && config.notify.content) {

    var template  = Handlebars.compile(config.notify.content)
    var content = template( metadata )

    var options = {
      body: content
    }

    if ( config.notify.headers ) {
      options.headers = config.notify.headers;
    }

    options.method = config.notify.method;

    if (config.notify.endpoint) {
      options.url = config.notify.endpoint
    }

    request(options, function(err, response, body) {
      if (err) {
        Logger.logger.error( { err: err }, ' notify error: @{err.message}' );
      } else {
        Logger.logger.info({ content: content}, 'A notification has been shipped: @{content}')
        if (body) {
          Logger.logger.debug( { body: body }, ' body: @{body}' );
        }
      }
    });

  }
}
