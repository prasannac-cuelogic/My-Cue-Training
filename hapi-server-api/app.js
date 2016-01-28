var hapi = require("hapi"),
    log = require("./utility/log");

// Load stuff from ".env" into "process.env"
require("dotenv").load();

var server = module.exports = new hapi.Server();

server.connection({
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT
});


require("./database");

require("./modules");

server.start(function() {
    log.write("Server running at:", server.info.uri);
});
