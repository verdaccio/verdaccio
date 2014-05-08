var $ = require('unopinionate').selector,
	onScroll = require('onscroll');

$(function() {
	var $header = $('header'),
		$content = $('#content'),
		bottomOffset = 52;

	var scrollFunc = function(top) {
		var limit =  $header.outerHeight() - bottomOffset;

		if(top < 0) {
			$header.css('top', 0);
		}
		else if(top > limit) {
			$header.css('top', -limit + 'px');
		}
		else {
			$header.css('top', -top + 'px');
		}
	};

	onScroll(scrollFunc);
	scrollFunc();

	$(window).resize(function() {
		$content.css('margin-top', $header.outerHeight());
	}).resize();
});