var Handlebars    = require('handlebars')
var request       = require('request')

var handleNotify = function(metadata, notifyEntry) {
  var regex
  if(metadata.name && notifyEntry.packagePattern) {
    regex = new RegExp(notifyEntry.packagePattern, notifyEntry.packagePatternFlags || '')
    if(!regex.test(metadata.name)) {
      return
    }
  }

  var template  = Handlebars.compile(notifyEntry.content)
  var content = template( metadata )

  var options = {
    body: content
  }

  if ( notifyEntry.headers ) {
    options.headers = notifyEntry.headers
  }

  options.method = notifyEntry.method

  if(notifyEntry.endpoint) {
    options.url = notifyEntry.endpoint
  }

  request(options)
}

module.exports.notify = function(metadata, config) {

  if (config.notify) {
    if(config.notify.content) {
      handleNotify(metadata, config.notify)
    }
    else {
      for(var key in config.notify) {
        if(config.notify.hasOwnProperty(key)) {
          handleNotify(metadata, config.notify[key])
        }
      }
    }
  }
}
