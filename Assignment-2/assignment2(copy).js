"use strict"
//Callback Example
var fs = require('fs');

fs.readFile('mydata.txt', function(err, buffer) {
    if (err) {
        // Handle error
        console.error(err.stack);
        return;
    }
    // try catch Example
    try {
        console.log("try " + buffer);
    } catch (err) {
        console.log("catch " + err);
    }

});
