var Handlebars    = require('handlebars')
var request       = require('request')

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

    if(config.notify.endpoint) {
      options.url = config.notify.endpoint
    }

    request(options);

  }
}
