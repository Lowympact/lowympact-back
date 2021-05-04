const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false, // not return the password
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    history: [
        {
            barcode: {
                type: String,
            },
            bcProductAddress: {
                type: String,
            },
            insertAt: {
                type: Date,
                default: Date.now(),
            },
        },
    ],
    cart: [
        {
            barcode: {
                type: String,
                required: true,
            },
            bcProductAddress: {
                type: String,
            },
            date: {
                type: Date,
                required: true,
            },
            quantity: {
                type: Number,
                default: 0,
            },
            carbonImpact: {
                type: Number,
                required: true,
            },
            ecoscore: {
                type: String,
                enum: ["a", "b", "c", "d", "e", "unknown"],
                required: [true, "Please provide an ecoscore"],
            },
        },
    ],
});

//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    //we have access to the user id since this is a method
    //options: expiresIn
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

//Match user entered password to hashed password in DB
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compareSync(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
