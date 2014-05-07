var $ = require('unopinionate').selector,
	template = require('../entry.handlebars');

$(function() {
	var $form	= $('#search-form'),
		$input	= $form.find('input'),
		$searchResults = $("#search-results"),
		$body	= $('body'),
		$clear	= $form.find('.clear'),
		request;

	$form.bind('submit keyup', function(e) {
		e.preventDefault();

		var q = $input.val();

		$body.addClass('state-search');

		//Switch the icons
		$clear
			[q  ? 'addClass' : 'removeClass']('icon-cancel')
			[!q ? 'addClass' : 'removeClass']('icon-search');

		if(q) {
			if(request) {
				request.abort();
			}

			request = $.getJSON('/-/search/' + q, function(results) {
				if(results.length) {
					var html = '';

					$.each(results, function(i, package) {
						html += template(package);
					});

					$searchResults.html(html);
				}
				else {
					$searchResults.html("<div class='no-results'><big>No Results</big></div>");
				}
			});
		}
		else {
			$searchResults.html('');
			$body.removeClass('state-search');
		}
	});

	$clear.click(function(e) {
		e.preventDefault();
		$input.val('');
		$form.keyup();
	});
});
