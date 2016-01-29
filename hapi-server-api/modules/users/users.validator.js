"use strict";
var promise = require("bluebird"),
    mongoose = promise.promisifyAll(require("mongoose")),
    log = require("../../utility/log"),
    security = require("../../utility/security");

var usersModel = mongoose.model("Users");

module.exports = {
    fetchOneUserDetails: fetchOneUserDetails,
    fetchUsersDetails: fetchUsersDetails
};


/**
 * Using userId get user information.
 */
function fetchOneUserDetails(request, reply) {

    log.write("modules > Users > users.validator.js > fetchOneUserDetails()");

    if (request.payload !== null) {
        var username = request.payload.username;
    }

    usersModel.findOne({
            "_id": request.params.userId
        }, "_id firstName lastName username")
        .populate("users")
        .execAsync()
        .then(function(userDetails) {

            if (!userDetails) {

                return new Promise(function(resolve, reject) {
                    reject("User doesn't exist.");
                });
            } else {

                if (typeof username !== "undefined" && username != userDetails.username) {
                    return usersModel.findOneAsync({
                        "username": username
                    });

                } else {

                    reply.data = {
                        userDetails: userDetails
                    };
                }
            }
        })
        .then(function(userDetails) {

            if (typeof username !== "undefined" && userDetails) {
                return new Promise(function(resolve, reject) {
                    reject("User with this username already exists.");
                });
            }

            reply.next();
        })
        .catch(function(err) {
            log.write(err);
            return reply.next(err);
        });
}
/**
 * END fetchOneUserDetails
 */


/**
 * Get all user information.
 */
function fetchUsersDetails(request, reply) {

    log.write("modules > Users > users.validator.js > fetchUsersDetails()");


    usersModel.find({}, "_id firstName lastName username")
        .populate("users")
        .execAsync()
        .then(function(usersDetails) {

            if (!usersDetails) {

                return new Promise(function(resolve, reject) {
                    reject("Users are not present.");
                });
            } else {
                reply.data = {
                    usersDetails: usersDetails
                };
                reply.next();
            }
        })
        .catch(function(err) {
            log.write(err);
            return reply.next(err);
        });
}
/**
 * END fetchUsersDetails
 */
