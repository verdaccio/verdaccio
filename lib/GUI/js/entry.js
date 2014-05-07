var $ = require('unopinionate').selector,
	onClick = require('onclick');

$(function() {
	onClick('.entry .name', function() {
		var $this = $(this),
			$entry = $this.closest('.entry');

		if($entry.hasClass('open')) {
			$entry
				.removeClass('open')
				.find('.readme').remove();
		}
		else {
			$entry.addClass('open');

			$.ajax({
				url: '/-/readme/'+$entry.attr('data-name')+'/'+$entry.attr('data-version'),
				dataType: 'text',
				success: function(html) {
					console.log(html);
					$("<div class='readme'>")
						.html(html)
						.appendTo($entry);
				}
			});
		}
	});
});