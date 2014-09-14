var $ = require('unopinionate').selector;

var bodyScrollers = [];

$(function() {
    var $html = $('html'),
        $body = $('body');

    $(window, document, 'body').bind('scroll touchmove', function() {
        var top = $html[0].scrollTop || $body[0].scrollTop;

        for(var i=0; i<bodyScrollers.length; i++) {
            bodyScrollers[i](top);
        }
    });
});

var onScroll = function(callback) {
    bodyScrollers.push(callback);
};

module.exports = onScroll;