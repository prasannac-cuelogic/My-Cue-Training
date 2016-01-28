"use strict";
var promise = require('bluebird'),
    mongoose = require('mongoose'),
    requireDir = require('require-directory');

var log = require("../utility/log");

exports.models = requireDir(module, './models');

mongoose.connect("mongodb://" + process.env.MONGODB_HOST + "/" + process.env.MONGODB_DATABASE, {
    user: process.env.MONGODB_USERNAME,
    pass: process.env.MONGODB_PASSWORD
});

mongoose.connection.on("error", function() {
    log.write("Mongoose database connection failed!");
});

mongoose.connection.once("open", function() {
    log.write("Mongoose database connection established.");
});

