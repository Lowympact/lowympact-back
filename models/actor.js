const mongoose = require("mongoose");

const ActorSchema = new mongoose.Schema({
    actorId: {
        type: String,
        required: true,
        unique: true,
    },
    actorName: {
        type: String,
        required: [true, "Please provide an actor name"],
        unique: false,
    },
    actorWalletAddress: {
        type: String,
        unique: true,
    },
    actorPassword: {
        type: String,
        required: [true, "Please provide a password"],
    },
});

module.exports = mongoose.model("Actor", ActorSchema);
