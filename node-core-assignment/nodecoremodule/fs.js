"use strict"
//Callback Example
var fs = require('fs');
//Event-driven Asynchronous Callbacks
fs.readFile('mydata.txt', function(err, buffer) {
    if (err) {
        // Handle error
        console.error(err.stack);
        return;
    }
    // try catch Example
    try {
        console.log(String(buffer));
    } catch (err) {
        console.log("catch " + err);
    }

});

console.log("Here 1")
