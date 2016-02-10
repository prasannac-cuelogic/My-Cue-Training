"use strict";

var promise = require("bluebird"),
    mongoose = promise.promisifyAll(require("mongoose"));


var security = require("../../utility/security"),
    log = require("../../utility/log");

var usersModel = mongoose.model("Users"),
    UsersActivityModel = mongoose.model("UsersActivity");

module.exports = {
    fetchUserDetails: fetchUserDetails,
    updateUserDetails: updateUserDetails,
    getNotLoginUserDetails: getNotLoginUserDetails
};

/**
 * User details.
 */
function fetchUserDetails(request, reply) {

    log.write("modules > users > users.controller.js > fetchUserDetails()");

    if (request.params.userId) {
        reply.data = {
            "userDetails": reply.data.userDetails,
            "message": "User found."
        };
    } else {
        reply.data = {
            "users": reply.data.usersDetails,
            "message": "Users found."
        };
    }

    reply.next();
}
/**
 * END fetchUserDetails
 */

/**
 * Update User details.
 */
function updateUserDetails(request, reply) {

    log.write("modules > users > users.controller.js > updateUserDetails()");
    var pocket = {},
        payloadObj = request.payload,
        userId = request.params.userId;

    pocket.SetUserDynamicDetails = {
        $set: {}
    };

    if (typeof userId !== "undefined") {

        if (typeof payloadObj.username !== "undefined") {
            pocket.SetUserDynamicDetails.$set["username"] = payloadObj.username;
        }

        if (typeof payloadObj.firstName !== "undefined") {
            pocket.SetUserDynamicDetails.$set["firstName"] = payloadObj.firstName;
        }

        if (typeof payloadObj.lastName !== "undefined") {
            pocket.SetUserDynamicDetails.$set["lastName"] = payloadObj.lastName;
        }

        usersModel.findByIdAndUpdateAsync({
                "_id": userId
            }, pocket.SetUserDynamicDetails)
            .then(function(userData) {

                if (!userData) {
                    return new Promise(function(resolve, reject) {
                        reject("User details are not updated.");
                    });
                } else {

                    reply.data = {
                        "message": "User details updated."
                    };
                    reply.next();
                }
            })
            .catch(function(err) {
                log.write(err);
                return reply.next(err);
            });
    } else {
        return new Promise(function(resolve, reject) {
            reject("UserId not present.");
        });
    }
}
/**
 * END updateUserDetails
 */

/**
 * Users who have not logged in since last 5 days.
 */
function getNotLoginUserDetails(request, reply) {

    log.write("modules > users > users.controller.js > getNotLoginUserDetails()");

    reply.data = {
            "userDetails": reply.data.usersDetails,
            "message": "User found."
        };
    reply.next();

    /*UsersActivityModel.aggregateAsync([{
            $group: {
                _id: "userId"
            },
            $match: {
                loginDate: {
                    $gt: new Date()
                }
            }
        }])
        .then(function(usersDetails) {
            console.log(usersDetails)
            console.log("HERE")
        })
        .catch(function(err) {
            log.write(err);
            return reply.next(err);
        });*/
}
/**
 * END getNotLoginUserDetails
 */
