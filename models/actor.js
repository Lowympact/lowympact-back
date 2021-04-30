const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ActorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide an actor name"],
        unique: false,
    },
    walletAddress: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
});

//Encrypt password
ActorSchema.pre("save", async function (next) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash("B4c0//", salt, function (err, hash) {
            this.password = hash;
        });
    });
});

//Sign JWT and return
ActorSchema.methods.getSignedJwtToken = function () {
    //we have access to the actor id since this is a method
    //options: expiresIn
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

//Match Actor entered password to hashed password in DB
ActorSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Actor", ActorSchema);
