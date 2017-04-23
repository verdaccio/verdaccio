let $ = require('unopinionate').selector;
let template = require('../entry.hbs');

$(function() {
  (function(window, document) {
    let $form = $('#search-form');
    let $input = $form.find('input');
    let $searchResults = $('#search-results');
    let $pkgListing = $('#all-packages');
    let $searchBtn = $('.js-search-btn');
    let request;
    let currentResults;

    let toggle = function(validQuery) {
      $searchResults.toggleClass('show', validQuery);
      $pkgListing.toggleClass('hide', validQuery);

      $searchBtn.find('i').toggleClass('icon-cancel', validQuery);
      $searchBtn.find('i').toggleClass('icon-search', !validQuery);
    };

    $form.bind('submit keyup', function(e) {
      let q, qBool;

      e.preventDefault();

      q = $input.val();
      qBool = (q !== '');

      toggle(qBool);

      if (!qBool) {
        if (request && typeof request.abort === 'function') {
          request.abort();
        }

        currentResults = null;
        $searchResults.html('');
        return;
      }

      if (request && typeof request.abort === 'function') {
        request.abort();
      }

      if (!currentResults) {
        $searchResults.html(
          '<img class=\'search-ajax\' src=\'-/static/ajax.gif\' alt=\'Spinner\'/>');
      }

      request = $.getJSON('-/search/' + q, function( results ) {
        currentResults = results;

        if (results.length > 0) {
          let html = '';

          $.each(results, function(i, entry) {
            html += template(entry);
          });

          $searchResults.html(html);
        } else {
          $searchResults.html(
            '<div class=\'no-results\'><big>No Results</big></div>');
        }
      });
    });

    $(document).on('click', '.icon-cancel', function(e) {
      e.preventDefault();
      $input.val('');
      $form.keyup();
    });
  })(window, window.document);
});
