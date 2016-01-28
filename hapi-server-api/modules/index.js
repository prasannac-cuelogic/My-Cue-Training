"use strict";

var globby = require('globby'),
    server = require('../app');

function initializeRoutes() {
    var routes,
        len;
    //serach the path
    globby(['**/*.route.js']).then(function(paths) {

        len = paths.length;
        while (len--) {
            paths[len] = processPath(paths[len]);
            routes = require(paths[len]);
            walkThroughRoutes(routes, server);
        }
    }).catch(function(err){
        console.log(err);
    });
}

function processPath(path) {
    var pathArr = path.split('/'),
        processedPath;

    pathArr.splice(0, 1);
    pathArr = pathArr.join('/');
    processedPath = './' + pathArr;
    return processedPath;
}

function walkThroughRoutes(routes, server) {
    Object.keys(routes).forEach(function(routeName) {
        server.route(routes[routeName]);
    });
}

initializeRoutes();
