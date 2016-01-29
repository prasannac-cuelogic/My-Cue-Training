"use strict";
var promise = require("bluebird"),
    mongoose = promise.promisifyAll(require("mongoose")),
    log = require("../../utility/log"),
    security = require("../../utility/security");

var usersModel = mongoose.model("Users"),
    UsersActivityModel = mongoose.model("UsersActivity");

module.exports = {
    userLogin: userLogin,
    userSignup: userSignup
};


/**
 * Verify user credentials (username + password) on login.
 */
function userLogin(request, reply) {

    log.write("modules > auth > auth.validator.js > userLogin()");

    var pocket = {};
    pocket.username = request.payload.username;
    pocket.password = request.payload.password;


    security.checkUserCredentials(pocket.username, pocket.password)
        .then(function(user) {

            if (!user) {
                return new Promise(function(resolve, reject) {
                    reject("Incorrect username or password.");
                });
            }

            reply.data = {
                "user": user
            };
            reply.next();
        })
        .catch(function(err) {

            log.write(err);
            return reply.next(err);
        });
}

/**
 * Validate request from user signup.
 */
function userSignup(request, reply) {

    log.write("modules > auth > auth.validator.js > userSignup()");

    var pocket = {};

    usersModel.findOneAsync({
            "username": request.payload.username
        })
        .then(function(userDetail) {

            if (userDetail) {

                if (userDetail.username === request.payload.username) {

                    // Disallow because user has an account and email address
                    return new Promise(function(resolve, reject) {
                        reject("You already have a account.");
                    });
                }
            } else {
                reply.next();
            }
        })
        .catch(function(err) {

            log.write(err);
            return reply.next(err);
        });
}
