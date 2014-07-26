var $ = require('unopinionate').selector,
	template = require('../entry.hbs'),
	onScroll = require('onscroll');

$(function() {
	'use strict';

	var $form	= $('#search-form'),
		$input	= $form.find('input'),
		$searchResults = $("#search-results"),
		$body	= $('body'),
		$clear	= $form.find('.clear'),
		request,
		currentResults;

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

			if(!currentResults) {
				$searchResults.html("<img class='search-ajax' src='/-/static/ajax.gif' alt='Spinner'/>");
			}

			request = $.getJSON('/-/search/' + q, function(results) {
				currentResults = results;

				if(results.length) {
					var html = '';

                    $.each(results, function(i, entry) {
                        html += template(entry);
					});

					$searchResults.html(html);
				}
				else {
					$searchResults.html("<div class='no-results'><big>No Results</big></div>");
				}
			});
		}
		else {
            request.abort();
			currentResults = null;
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
