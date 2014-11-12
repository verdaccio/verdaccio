// twitter bootstrap stuff;
// not in static 'cause I want it to be bundled with the rest of javascripts
require('./bootstrap-modal')

// our own files
require('./search')
require('./entry')

var $ = require('unopinionate').selector
$(document).on('click', '.js-userLogoutBtn', function() {
  $('#userLogoutForm').submit()
  return false
})
