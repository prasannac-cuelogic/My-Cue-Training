"use strict";
var mongoose = require("mongoose");

var schema = {

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
    ip: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: null
    }
}

var mongooseSchema = new mongoose.Schema(schema);

mongooseSchema.pre("save", function(next) {

    var now = new Date();

    if (!this.date) {
        this.date = now;
    }

    next();
});

mongoose.model("UsersActivity",mongooseSchema);
