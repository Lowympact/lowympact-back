const mongoose = require("mongoose");
// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
// Else findByIdAndUpdate would be deprecated
mongoose.set("useFindAndModify", false);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ActorSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please provide an actor name"],
		unique: false,
	},
	email: {
		type: String,
		required: [true, "Please provide an email"],
		unique: true,
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			"Please add a valid email",
		],
	},
	walletAddress: {
		type: String,
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Please provide a password"],
		minlength: 6,
		select: false, // by default, does not return the password when Actor.find({...});
	},
});

// Encrypt password
ActorSchema.pre("save", function (next) {
	actor = this;
	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(actor.password, salt, function (err, hash) {
			actor.password = hash;
			next();
		});
	});
});

// Sign JWT and return
ActorSchema.methods.getSignedJWT = function () {
	//we have access to the actor id since this is a method
	//options: expiresIn
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_COOKIE_EXPIRE,
	});
};

// Match actor entered password to hashed password in DB
ActorSchema.methods.matchPassword = function (enteredPassword) {
	return bcrypt.compareSync(enteredPassword, this.password);
};

module.exports = mongoose.model("Actor", ActorSchema);
