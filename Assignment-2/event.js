"use strict"
//Event loop Example
var fs = require('fs'),
    eventNum = 0;

fs.watch("mydata.txt", function(event, filename) {
    eventNum++;
    console.log('Event #'+ eventNum + ':'+ event + ', for file:'+ filename);
});

console.log("Now watching mydata.text for changes...");
