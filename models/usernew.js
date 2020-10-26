//---------------import packages-------------------------
const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

//--------------create User modal-----------------
const userToken = new Schema({
    token: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true
    }

}, {
    timestamps: true,
});

module.exports = mongoose.model("userToken", userToken);