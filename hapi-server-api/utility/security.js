"use strict";

var promise = require("bluebird"),
    bcrypt = promise.promisifyAll(require("bcryptjs")),
    redis = require("redis"),
    redisClient = promise.promisifyAll(redis.createClient()),
    mongoose = require("mongoose"),
    jwt = promise.promisifyAll(require("jsonwebtoken"));

var tokenSecret = process.env.TOKEN_SECRET;

var log = require("../utility/log");

module.exports = {
    checkUserCredentials: checkUserCredentials,
    createToken: createToken,
    verifyToken: verifyToken
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
/**
 * END checkUserCredentials
 */

/**
 * Create a new authentication token and store on Redis.
 */
function createToken(tokenPayload) {

    log.write("utility > security.js > createToken()");

    var keyToken,
        authToken;

    keyToken = jwt.sign(tokenPayload, tokenSecret);
    tokenPayload.coreToken = keyToken;

    authToken = jwt.sign(tokenPayload, tokenSecret);

    // Push to Redis
    redisClient.HMSET(keyToken, tokenPayload);

    tokenPayload.token = authToken;

    // Delete core token from object
    delete tokenPayload.coreToken;

    return tokenPayload;
}
/**
 * END createToken
 */

/**
 * Decode and check authentication token's existence on Redis.
 */
function verifyToken(token) {

    log.write("utility > security.js > verifyToken()");

    return new promise(function(resolve, reject) {

        if (!token) {
            return reject("Token could not be verified.");
        }

        var pocket = {};
        pocket.isTokenDecoded = false;
        pocket.isCoreTokenExist = false;
        pocket.decoded = null;

        jwt.verifyAsync(token, tokenSecret)
            .then(function(decoded) {

                if (decoded && decoded.coreToken) {
                    pocket.isTokenDecoded = true;
                    pocket.decoded = decoded;

                    return redisClient.HSCANAsync(decoded.coreToken, 0);
                }
            })
            .then(function(credentials) {

                if (credentials && credentials[1].length !== 0) {
                    pocket.isCoreTokenExist = true;
                }
            })
            .then(function() {

                if (pocket.isTokenDecoded && pocket.isCoreTokenExist) {
                    delete pocket.decoded.coreToken;
                    return resolve(pocket.decoded);
                } else {
                    return reject("Invalid token.");
                }
            })
            .catch(function(err) {

                log.write(err);
                return reject(err);
            });
    });
}
/**
 * END verifyToken
 */
