let $ = require('unopinionate').selector;
let onClick = require('onclick');
let transitionComplete = require('transition-complete');

$(function() {
  onClick('.entry .name', function() {
    let $this = $(this);
    let $entry = $this.closest('.entry');

    if ($entry.hasClass('open')) {
      // Close entry
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
    } else {
      // Open entry
      $('.entry.open').each(function() {
        // Close open entries
        let $entry = $(this);
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

      // Add the open class
      $entry.addClass('open');

      // Explicitly set heights for transitions
      let height = $entry.outerHeight();
      $entry
        .attr('data-height', height)
        .css('height', height);

      // Get the data
      $.ajax({
        url: '-/readme/'
           + encodeURIComponent($entry.attr('data-name')) + '/'
           + encodeURIComponent($entry.attr('data-version')),
        dataType: 'text',
        success: function(html) {
          let $readme = $('<div class=\'readme\'>')
                          .html(html)
                          .appendTo($entry);

          $entry.height(height + $readme.outerHeight());

          transitionComplete(function() {
            $entry.css('height', 'auto');
          });
        },
      });
    }
  });
});
