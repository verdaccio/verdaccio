var $ = require('unopinionate').selector;

var $document   = $(document),
    bindings    = {};

var click = function(events) {
    click.bind.apply(click, arguments);
    return click;
};

/*** Configuration Options ***/
click.distanceLimit = 10;
click.timeLimit     = 140;

/*** Useful Properties ***/
click.isTouch = ('ontouchstart' in window) ||
                window.DocumentTouch &&
                document instanceof DocumentTouch;

/*** Cached Functions ***/
var onTouchstart = function(e) {
    e.stopPropagation(); //Prevents multiple click events from happening

    click._doAnywheres(e);

    var $this       = $(this),
        startTime   = new Date().getTime(),
        startPos    = click._getPos(e);

    $this.one('touchend', function(e) {
        e.preventDefault(); //Prevents click event from firing
        
        var time        = new Date().getTime() - startTime,
            endPos      = click._getPos(e),
            distance    = Math.sqrt(
                Math.pow(endPos.x - startPos.x, 2) +
                Math.pow(endPos.y - startPos.y, 2)
            );

        if(time < click.timeLimit && distance < click.distanceLimit) {
            //Find the correct callback
            $.each(bindings, function(selector, callback) {
                if($this.is(selector)) {
                    callback.apply(e.target, [e]);
                    return false;
                }
            });
        }
    });
};

/*** API ***/
click.bind = function(events) {

    //Argument Surgery
    if(!$.isPlainObject(events)) {
        newEvents = {};
        newEvents[arguments[0]] = arguments[1];
        events = newEvents;
    }

    $.each(events, function(selector, callback) {

        /*** Register Binding ***/
        if(typeof bindings[selector] != 'undefined') {
            click.unbind(selector); //Ensure no duplicates
        }
        
        bindings[selector] = callback;

        /*** Touch Support ***/
        if(click.isTouch) {
            $document.delegate(selector, 'touchstart', onTouchstart);
        }

        /*** Mouse Support ***/
        $document.delegate(selector, 'click', function(e) {
            e.stopPropagation(); //Prevents multiple click events from happening
            //click._doAnywheres(e); //Do anywheres first to be consistent with touch order
            callback.apply(this, [e]);
        });
    });

    return this;
};

click.unbind = function(selector) {
    $document
        .undelegate(selector, 'touchstart')
        .undelegate(selector, 'click');

    delete bindings[selector];

    return this;
};

click.unbindAll = function() {
    $.each(bindings, function(selector, callback) {
        $document
            .undelegate(selector, 'touchstart')
            .undelegate(selector, 'click');
    });
    
    bindings = {};

    return this;
};

click.trigger = function(selector, e) {
    e = e || $.Event('click');

    if(typeof bindings[selector] != 'undefined') {
        bindings[selector](e);
    }
    else {
        console.error("No click events bound for selector '"+selector+"'.");
    }

    return this;
};

click.anywhere = function(callback) {
    click._anywheres.push(callback);
    return this;
};

/*** Internal (but useful) Methods ***/
click._getPos = function(e) {
    e = e.originalEvent;

    if(e.pageX || e.pageY) {
        return {
            x: e.pageX,
            y: e.pageY
        };
    }
    else if(e.changedTouches) {
        return {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };
    }
    else {
        return {
            x: e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
            y: e.clientY + document.body.scrollTop  + document.documentElement.scrollTop
        };
    }
};

click._anywheres = [];

click._doAnywheres = function(e) {
    var i = click._anywheres.length;
    while(i--) {
        click._anywheres[i](e);
    }
};

$(document).bind('mousedown', click._doAnywheres);

module.exports = click;

