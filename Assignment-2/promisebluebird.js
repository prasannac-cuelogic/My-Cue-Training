"use strict"
var Promise = require('bluebird'),
    fs = Promise.promisifyAll(require('fs'));

//call the promise function
fs.readFileAsync("mydata.txt", "utf8").then(function(contents) {
    console.log(contents);
    return fs.appendFileAsync('mydata.txt', contents, 'utf8');
}).then(function(returnContent) {
    console.log("Append data");
}).catch(function(e) {
    console.error(e);
});
