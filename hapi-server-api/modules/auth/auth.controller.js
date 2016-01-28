"use strict";

var promise = require("bluebird"),
    mongoose = promise.promisifyAll(require("mongoose")),
    bcrypt = promise.promisifyAll(require("bcryptjs"));

var usersModel = mongoose.model("Users"),
    UsersActivityModel = mongoose.model("UsersActivity");

var security = require("../../utility/security"),
    log = require("../../utility/log");

module.exports = {
    authLogin: authLogin,
    userSignup: userSignup
};

/**
 * User to login.
 */
function authLogin(request, reply) {

    log.write("modules > auth > auth.controller.js > authLogin()");

    var pocket = {};
    pocket.user = reply.data.user;
    pocket.username = request.payload.username;
    //pocket.tokenPayload = null;
    //pocket.__s = null;
    //pocket.now = new Date().toISOString();

    pocket.objUsersActivity = {
        "userId": pocket.user._id,
        "ip": request.info.remoteAddress,
        "userAgent": request.headers['user-agent']
    }

    var newUsersActivityModel = new UsersActivityModel(pocket.objUsersActivity);

    newUsersActivityModel.saveAsync().then(function(userActivity) {
            if (!userActivity) {
                log.write("modules > auth > auth.controller.js > UsersActivityModel");
                return promise.reject("User activity not stored.");
            }

            reply.data = {
                "message": "Logged in successfully."
            };
            reply.next();
        })
        .catch(function(err) {
            reply.next(err);
        });
}

/**
 * Process request from creator to signup.
 */
function userSignup(request, reply) {

    log.write("modules > auth > auth.controller.js > userSignup()");

    var pocket = {};

    bcrypt.hashAsync(request.payload.password, parseInt(process.env.SALT_LENGTH))
        .then(function(hashedPassword) {

            if (!hashedPassword) {
                return promise.reject("Creator signup failed. Please retry.");
            }

            // Add to user collection
            pocket.userObj = {
                "username": request.payload.username,
                "password": hashedPassword,
                "firstName": request.payload.firstName,
                "lastName": request.payload.lastName
            };

            var newUser = new usersModel(pocket.userObj);
            return newUser.saveAsync();
        })
        .then(function(objUser) {

            if (!objUser) {
                return promise.reject("User signup failed. Please retry.");
            }
            reply.data = {
                "message": "Your account has been created."
            };
            reply.next();
        })
        .catch(function(err) {

            log.write(err);
            return reply.next(err);
        });
}
