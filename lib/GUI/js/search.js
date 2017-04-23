let $ = require('unopinionate').selector;
let template = require('../entry.hbs');

$(function() {
  ;(function(window, document) {
    var $form          = $('#search-form')
    var $input         = $form.find('input')
    var $searchResults = $('#search-results')
    var $pkgListing    = $('#all-packages')
    var $searchBtn     = $('.js-search-btn')
    var request
    var lastQuery      = ''

    var toggle = function(validQuery) {
      $searchResults.toggleClass('show', validQuery)
      $pkgListing.toggleClass('hide', validQuery)

      $searchBtn.find('i').toggleClass('icon-cancel', validQuery)
      $searchBtn.find('i').toggleClass('icon-search', !validQuery)
    }

    $form.bind('submit keyup', function(e) {
      var query, isValidQuery


      e.preventDefault();

      query = $input.val()
      isValidQuery = (query !== '')

      toggle(isValidQuery)

      if (!isValidQuery) {
        if (request && typeof request.abort === 'function') {
          request.abort();
        }

        $searchResults.html('')
        return;
      }

      if (request && typeof request.abort === 'function') {
        request.abort();
      }

      if (query !== lastQuery) {
        lastQuery = query
        $searchResults.html(
          '<img class=\'search-ajax\' src=\'-/static/ajax.gif\' alt=\'Spinner\'/>');
      }

      request = $.getJSON('-/search/' + query, function( results ) {
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
      }).fail(function () {
          $searchResults.html(
            "<div class='no-results'><big>No Results</big></div>")
      })
    })

    $(document).on('click', '.icon-cancel', function(e) {
      e.preventDefault();
      $input.val('');
      $form.keyup();
    });
  })(window, window.document);
});
