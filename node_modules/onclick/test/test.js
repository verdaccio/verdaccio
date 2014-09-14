var sinon = require('sinon'),
    click = require('../src/onClick'),
    module = window.module,
    sandbox,
    testCallback;

module("onClick", {
    setup: function() {
        sandbox         = sinon.sandbox.create();
        testCallback    = sinon.spy();
    },
    teardown: function() {
        click.unbindAll();
    }
});

test("#trigger", function() {
    click({
        '#button': testCallback
    });

    click.trigger('#button');
    ok(testCallback.called);
});

test("#unbindAll", function() {
    click({
        '#button': testCallback
    })
        .unbindAll()
        .trigger('#button');

    ok(!testCallback.called);
});

test("#bind object syntax", function() {
    click
        .bind({
            '#button': testCallback
        })
        .trigger('#button');

    ok(testCallback.called);
});

test("#bind argument syntax", function() {
    click
        .bind('#button', testCallback)
        .trigger('#button');

    ok(testCallback.called);
});

test("#unbind", function() {
    click
        .bind('#button', testCallback)
        .unbind('#button')
        .trigger('#button');

    ok(!testCallback.called);
});

test("#_getPos", function() {
    //pageX/pageY
    var pos = click._getPos({
        originalEvent: {
            pageX: 100,
            pageY: 200
        }
    });

    deepEqual(pos.x, 100, "x Position (pageX/pageY case)");
    deepEqual(pos.y, 200, "y Position (pageX/pageY case)");

    //changedTouches
    pos = click._getPos({
        originalEvent: {
            changedTouches: [
                {
                    clientX: 100,
                    clientY: 200
                }
            ]
        }
    });

    deepEqual(pos.x, 100, "x Position (changedTouches)");
    deepEqual(pos.y, 200, "y Position (changedTouches)");

    //clientX
    pos = click._getPos({
        originalEvent: {
            clientX: 100,
            clientY: 200
        }
    });

    deepEqual(pos.x, 100, "x Position (changedTouches)");
    deepEqual(pos.y, 200, "y Position (changedTouches)");
});

test("Standard Click Event (Browser w/ Mouse)", function() {
    click({
        '#button': testCallback
    });

    $('#button').click();
    ok(testCallback.called);
});

test("Two arguments (not object configuration)", function() {
    click('#button', testCallback);

    $('#button').click();
    ok(testCallback.called);
});

/*** Touch Tests ***/
var $button,
    eStart,
    eEnd;

module("Touch Click", {
    setup: function() {
        sandbox         = sinon.sandbox.create();
        testCallback    = sinon.spy();

        click.isTouch = true; //Fake touch

        $button = $('#button');

        click({
            '#button': testCallback
        });

        eStart = $.Event('touchstart');
        eStart.originalEvent = {
            pageX: 1,
            pageY: 1
        };

        eEnd = $.Event('touchend');
        eEnd.originalEvent = {
            pageX: 1,
            pageY: 1
        };
    },
    teardown: function() {
        click.unbindAll();
        click.isTouch = false;
    }
});

asyncTest("Successful Touch Click", function() {
    $button.trigger(eStart);

    setTimeout(function() {
        $button.trigger(eEnd);
        ok(testCallback.called);
        start();
    }, 10);
});

asyncTest("Distance Fail", function() {
    eEnd.originalEvent = {
        pageX: click.distanceLimit,
        pageY: click.distanceLimit
    };

    $button.trigger(eStart);

    setTimeout(function() {
        $button.trigger(eEnd);
        ok(!testCallback.called, "Distance Fail");
        start();
    }, 10);
});

asyncTest("Timeout Fail", function() {
    $button.trigger(eStart);

    setTimeout(function() {
        $button.trigger(eEnd);
        ok(!testCallback.called, "Distance Fail");
        start();
    }, click.timeLimit + 1);
});

asyncTest("Different Element Fail", function() {
    $button.trigger(eStart);

    setTimeout(function() {
        $('body').trigger(eEnd);
        ok(!testCallback.called, "Distance Fail");
        start();
    }, 10);
});

