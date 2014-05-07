var $ = require('unopinionate').selector,
	template = require('../entry.handlebars');

$(function() {
	var $form = $('#search-form'),
		$input = $form.find('input'),
		$searchResults = $("#search-results"),
		$body = $('body'),
		request;

	$form.bind('submit keyup', function(e) {
		e.preventDefault();

		var q = $input.val();

		$body.addClass('state-search');

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

	$form.find('.clear').click(function(e) {
		e.preventDefault();
		$input.val('');
		$form.keyup();
	});
});
