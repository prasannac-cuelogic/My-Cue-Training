var series = require("hapi-next"),
    validator = require("./auth.validator"),
    controller = require("./auth.controller"),
    joi = require("joi");

module.exports = {

    userSignup: {
        method: "POST",
        path: "/auth/signup",
        config: {
            description: "user signup",
            validate: {
                payload: {
                    firstName: joi.string().required(),
                    lastName: joi.string().required(),
                    username: joi.string().email().required(),
                    password: joi.string().min(6).required()
                }
            },
            handler: function(request, reply) {

                var functionSeries = new series([
                    validator.userSignup,
                    controller.userSignup
                ]);

                functionSeries.execute(request, reply);
            }
       }
    },
    authLogin: {
        method: "POST",
        path: "/auth/login",
        config: {
            description: "User login",
            validate: {
                payload: {
                    username: joi.string().email().required(),
                    password: joi.string().min(6).required()
                }
            },
            handler: function(request, reply) {

                var functionSeries = new series([
                    validator.userLogin,
                    controller.authLogin
                ]);

                functionSeries.execute(request, reply);
            }
        }
    }
};
