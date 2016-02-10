var series = require("hapi-next"),
    validator = require("./users.validator"),
    controller = require("./users.controller"),
    joi = require("joi");

module.exports = {

    getUserDetails: {
        method: "GET",
        path: "/user/{userId}",
        config: {
            auth: "Main",
            description: "userId using get user details",
            validate: {
                params: {
                    userId: joi.string().required()
                }
            },
            handler: function(request, reply) {

                var functionSeries = new series([
                    validator.fetchOneUserDetails,
                    controller.fetchUserDetails
                ]);

                functionSeries.execute(request, reply);
            }
        }
    },
    getUsersLsit: {
        method: "GET",
        path: "/user/list",
        config: {
            auth: "Main",
            description: "featch all uses details",
            handler: function(request, reply) {

                var functionSeries = new series([
                    validator.fetchUsersDetails,
                    controller.fetchUserDetails
                ]);

                functionSeries.execute(request, reply);
            }
        }
    },
    updateUserDetails: {
        method: "POST",
        path: "/user/{userId}",
        config: {
            auth: "Main",
            description: "user signup",
            validate: {
                payload: {
                    firstName: joi.string(),
                    lastName: joi.string(),
                    username: joi.string().email()
                },
                params: {
                    userId: joi.string().required()
                }
            },
            handler: function(request, reply) {

                var functionSeries = new series([
                    validator.fetchOneUserDetails,
                    controller.updateUserDetails
                ]);

                functionSeries.execute(request, reply);
            }
       }
    },
    getNotLoginUsersDetails: {
        method: "GET",
        path: "/users/notlogin",
        config: {
            auth: "Main",
            description: "Users who have not logged in since last 5 days",
            handler: function(request, reply) {

                var functionSeries = new series([
                    validator.fetchUsersDetails,
                    validator.fetchInactiveUsers,
                    controller.getNotLoginUserDetails
                ]);

                functionSeries.execute(request, reply);
            }
       }
    },
};
