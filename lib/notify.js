var Handlebars    = require('handlebars')
var request       = require('request')
var Logger        = require('./logger')

var handleNotify = function(metadata, notifyEntry) {
  var regex
  if (metadata.name && notifyEntry.packagePattern) {
    regex = new RegExp(notifyEntry.packagePattern, notifyEntry.packagePatternFlags || '')
    if (!regex.test(metadata.name)) {
      return
    }
  }

  var template  = Handlebars.compile(notifyEntry.content)
  var content = template( metadata )

  var options = {
    body: content
  }

    // provides fallback support, it's accept an Object {} and Array of {}
    if (notifyEntry.headers && Array.isArray(notifyEntry.headers)) {
      var header = {}
      notifyEntry.headers.map(function(item) {
        if (Object.is(item, item)) {
          for (var key in item) {
            header[key] = item[key]
          }
        }
      })
      options.headers = header;
    } else if (Object.is(notifyEntry.headers, notifyEntry.headers)) {
      options.headers = notifyEntry.headers
    }

  options.method = notifyEntry.method

  if ( notifyEntry.endpoint ) {
    options.url = notifyEntry.endpoint
  }

  request(options, function(err, response, body) {
      if (err) {
        Logger.logger.error( { err: err }, ' notify error: @{err.message}' )
      } else {
        Logger.logger.info({ content: content}, 'A notification has been shipped: @{content}')
        if (body) {
          Logger.logger.debug( { body: body }, ' body: @{body}' )
        }
      }
    })
}

module.exports.notify = function(metadata, config) {

  if (config.notify) {
    if (config.notify.content) {
      handleNotify(metadata, config.notify)
    }
    else {
      for (var key in config.notify) {
        if (config.notify.hasOwnProperty(key)) {
          handleNotify(metadata, config.notify[key])
        }
      }
    }
  }
}
