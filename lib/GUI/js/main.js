// twitter bootstrap stuff;
// not in static 'cause I want it to be bundled with the rest of javascripts
require('./bootstrap-modal')

// our own files
require('./search')
require('./entry')

$(document).on('click', 'a.submit', function() {
	$(this).parent('form').submit()
	return false
})
