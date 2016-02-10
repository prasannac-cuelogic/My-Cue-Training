"use strict";

var fs = require("fs");
var data = '';

// Create a readable stream
var readerStream = fs.createReadStream('mydata.txt');

// Set the encoding to be utf8.
readerStream.setEncoding('UTF8');

// Handle stream events --> data, end, and error
readerStream.on('data', function(chunk) {
   data += chunk;
});

//use stdout and print directly data
readerStream.pipe(process.stdout);

readerStream.on('end',function(){
   console.log(data);
});

readerStream.on('error', function(err){
   console.log(err.stack);
});

console.log("Program Ended");
