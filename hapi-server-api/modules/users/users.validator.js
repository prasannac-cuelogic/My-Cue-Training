"use strict";
var promise = require("bluebird"),
    mongoose = promise.promisifyAll(require("mongoose")),
    log = require("../../utility/log"),
    security = require("../../utility/security"),
    moment = require("moment");

var usersModel = mongoose.model("Users"),
    UsersActivityModel = mongoose.model("UsersActivity");

module.exports = {
    fetchOneUserDetails: fetchOneUserDetails,
    fetchUsersDetails: fetchUsersDetails,
    fetchInactiveUsers: fetchInactiveUsers
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

/**
 * Get Users who have not logged in since last 5 days
 */
function fetchInactiveUsers(request, reply) {
    log.write("modules > Users > users.validator.js > fetchInactiveUsers()");

    var startdate = moment().subtract(process.env.NOT_LOGIN, "days");
    console.log(startdate)

    UsersActivityModel.find({})
        .populate({
            path: 'Users',
        })
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
    /*UsersActivityModel.aggregateAsync({
            $group: {
                _id: "$userId",
                loginDate: {
                    $max: "$date"
                }
            }
        }, {
            $match: {
                loginDate: {
                    $lte: new Date(startdate)
                }
            }
        })
        .then(function(users) {

            if(!users) {
                return new Promise(function(resolve, reject) {
                    reject("Last 5 days inactive users are not present.");
                });
            }

            reply.data = {
                users: users,
                startDate: startdate
            }
            reply.next()
        })
        .catch(function(err) {

            reply.next(err)
        });*/
}
/**
 * End fetchInactiveUsers
 */
