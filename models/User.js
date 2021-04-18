const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	firstname: { type: String, required: true },
	mail: { type: String, required: true },
	pwd: { type: String, required: true },
	pwdResetDate: { type: Date}, // pwd reset date
	pwdResetToken: { type: String }, //pwd reset token
	phone: { type: String },
	status: { type: String, enum: ['admin', 'operator', 'user'], default: 'user' },
	places: [{
		role: { type: String, enum: ['owner', 'manager', 'waiter'] },		//if operator, the status he has in the bar
		barId: { type: Schema.Types.ObjectId, ref: 'Bar' }
	}],
	//check: { type: Number, enum: [0, 1], default: '0' },					//1 = mail is valid
	lastConnection: { type: Date, default: Date.now },
	creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);