unopinionate.js
===============
Unopinionated front-end libraries

The goal of this project is to create a shim that can be used in lieu of explicit dependencies for common but competing front-end JavaScript libraries.  For instance, many projects depend on a selector library such as jQuery or Zepto but bundling or requiring a specific dependency means that those using a competing dependency will either need to include both or resort to something that uses their existing stack.

Unopinionate looks for common libraries (e.g. jQuery, Zepto) that fill a specific roll (selector libraries).  Instead of depending on the library explicitly, depend on unopionate.js to deliver whatever library the user chooses.

```javascript
var $ = unopinionate.selector;
```

Unopinionate works with CommonJS and AMD as well:

```javascript
//CommonJS
var $ = require('unopinionate').selector;

//AMD (RequireJS)
require([
    'unopinionate'
], function(unopinionate) {
    var $ = unopinionate.selector;
});
```

This was inspired by the way Backbone.js handles selector libraries.

Supported Libraries
-------------------
- selector
    - jQuery
    - Zepto
    - Ender

- template
    - Mustache
    - Handlebars

More to come...pull requests welcome.

