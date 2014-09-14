onClick.js [![Build Status](https://travis-ci.org/bpeacock/onClick.png?branch=master)](https://travis-ci.org/bpeacock/onClick)
===============

A click controller for mouse & touch.

- Prevents 300ms delay on touch
- Touch interactions like scrolling work as expected
- Handles devices that have both touch and mouse
- Delegates events for efficiency

Installation
------------

```bash
npm install onclick
```

A jQuery-like selector library is required:
- jQuery 1.4.3+
- Zepto

Usage
-----

```javascript
onClick({
    '#element': function(e) {
        alert("I was clicked!");
    }
});

onClick('.myclass', function() {

});
```

Check out a live [example](http://htmlpreview.github.io/?https://github.com/bpeacock/onClick/blob/master/examples/index.html).

Development
-----------

To Build:   `grunt build`

To Develop: `grunt watch`

To Test:    `npm test`
 
