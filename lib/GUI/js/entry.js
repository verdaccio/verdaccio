var $ = require('unopinionate').selector,
	onClick = require('onclick'),
	transitionComplete = require('transition-complete');

$(function() {
	onClick('.entry .name', function() {
		var $this = $(this),
			$entry = $this.closest('.entry');

		//Close entry
		if($entry.hasClass('open')) {
			$entry
				.height($entry.outerHeight())
				.removeClass('open');

			setTimeout(function() {
				$entry.css('height', $entry.attr('data-height') + 'px');
			}, 0);

			transitionComplete(function() {
				$entry.find('.readme').remove();
				$entry.css('height', 'auto');
			});
		}
		//Open entry
		else {
			//Close open entries
			$('.entry.open').each(function() {
				var $entry = $(this);
				$entry
					.height($entry.outerHeight())
					.removeClass('open');

				setTimeout(function() {
					$entry.css('height', $entry.attr('data-height') + 'px');
				}, 0);

				transitionComplete(function() {
					$entry.find('.readme').remove();
					$entry.css('height', 'auto');
				});
			});

			//Add the open class
			$entry.addClass('open');

			//Explicitly set heights for transitions
			var height = $entry.outerHeight();
			$entry
				.attr('data-height', height)
				.css('height', height);

			//Get the data
			$.ajax({
				url: '/-/readme/'+$entry.attr('data-name')+'/'+$entry.attr('data-version'),
				dataType: 'text',
				success: function(html) {
					var $readme = $("<div class='readme'>")
						.html(html)
						.appendTo($entry);

					$entry.height(height + $readme.outerHeight());

					transitionComplete(function() {
						$entry.css('height', 'auto');
					});
				}
			});
		}
	});
});
