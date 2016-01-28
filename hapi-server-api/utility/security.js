"use strict";

var promise = require("bluebird"),
    bcrypt = promise.promisifyAll(require("bcryptjs")),
    /*redis = require("redis"),
    redisClient = promise.promisifyAll(redis.createClient()),*/
    mongoose = require("mongoose");
    //jwt = promise.promisifyAll(require("jsonwebtoken")),
    //crypto = require('crypto');

var tokenSecret = process.env.TOKEN_SECRET;

var log = require("../utility/log");

module.exports = {
    checkUserCredentials: checkUserCredentials
};

/**
 * Check user credentials (username + password) with database.
 */
function checkUserCredentials(username, password) {

    log.write("utility > security.js > checkUserCredentials()");

    return new promise(function(resolve, reject) {

        var pocket = {},
            userModel = mongoose.model("Users"),
            userSelectClause = "_id username password";

        pocket.user = null;
        pocket.isUsernameValid = false;
        pocket.isPasswordValid = false;


        userModel.findOne({
                "username": username,
            }, userSelectClause)
            .lean()
            .execAsync()
            .then(function(user) {

                if (user) {

                    pocket.isUsernameValid = true;
                    pocket.user = user;
                }
            })
            .then(function() {

                if (pocket.isUsernameValid) {

                    if (pocket.user.password !== null && pocket.user.password.length > 0) {
                        return bcrypt.compareAsync(password, pocket.user.password);
                    }
                }
            })
            .then(function(isMatch) {

                if (isMatch === true) {
                    pocket.isPasswordValid = true;
                }
            })
            .then(function() {

                if (pocket.isUsernameValid && pocket.isPasswordValid) {
                    return resolve(pocket.user);
                } else {
                    return resolve(false);
                }
            })
            .catch(function(err) {

                log.write(err);
                return reject(err);
            });
    });
}
