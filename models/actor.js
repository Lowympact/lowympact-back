const mongoose = require("mongoose");

const ActorSchema = new mongoose.Schema({
    actorName: {
        type: String,
        required: [true, "Please add an actor name"],
        unique: true,
    },
    actorWalletAddress: {
        type: String,
        unique: true,
    },
});

module.exports = mongoose.model("Actor", ActorSchema);
