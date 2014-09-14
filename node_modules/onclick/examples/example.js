var click = require("../src/onClick.js");

click({
    '#element': function(e) {
        alert("You clicked!");
    }
});

click('.elementSet', function(e) {
    alert("You clicked the set");
});
