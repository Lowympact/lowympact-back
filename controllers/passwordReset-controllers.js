const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const HttpError = require('../models/HttpError');
const passwordReset = require('../util/passwordReset');
const bcrypt = require ('bcryptjs');

const User = require('../models/User');

/* POST */

const startPasswordReset = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
		);
	}
	console.log(req.body);

	const { userMail } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({mail : userMail})
	} catch (err) {
		const error = new HttpError(
			'PasswordReset: starting process failed, please try againt later.',
			500
		);
		return next(error);
	}

	if(!existingUser) {
		const error = new HttpError(
			'PasswordReset: this mail does not exists.',
			500
		);
		return next(error);
	}

	//Generate date and token
	existingUser.pwdResetDate = Date.now();
	existingUser.pwdResetToken = passwordReset.generate_token(32);

	try {
		await existingUser.save();
	} catch (err) {
		const error = new HttpError(
			'PasswordReset: could not update user.',
			500
		);
		return next(error);
	}

	try {
		await passwordReset.sendResetEmail(existingUser.mail, existingUser.firstname, existingUser.pwdResetToken, existingUser.pwdResetDate);;
	} catch (err) {
		const error = new HttpError(
			'PasswordReset: sending mail failed, please try again.',
			500
		);
		return next(error);
	}

	res.json({message: 'PasswordReset: mail sent!'});

}

const endPasswordReset = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
		);
	}
	console.log(req.body);

	const { userToken, userPassword } = req.body;

	if(userToken == null){
		const error = new HttpError(
			'PasswordReset: missing token.',
			500
		);
		return next(error);
	}

	if(userPassword == null){
		const error = new HttpError(
			'PasswordReset: missing password.',
			500
		);
		return next(error);
	}

	let existingUser;
	try {
		existingUser = await User.findOne({pwdResetToken : userToken})
	} catch (err) {
		const error = new HttpError(
			'PasswordReset: starting process failed, please try againt later.',
			500
		);
		return next(error);
	}

	if(!existingUser) {
		const error = new HttpError(
			'PasswordReset: this token does not exists.',
			500
		);
		return next(error);
	}

	let msSinceTokenGeneration = Date.now() - existingUser.pwdResetDate;
	let minSinceTokenGeneration = Math.round(((msSinceTokenGeneration % 86400000) % 3600000) / 60000);

	if(minSinceTokenGeneration > 20) {
		const error = new HttpError(
			'PasswordReset: this token has expired.',
			500
		);
		return next(error);
	}

	//Remove token and date
	existingUser.pwdResetDate = null;
	existingUser.pwdResetToken = null;

	//Hash new password
	bcrypt.hash(userPassword, 10).then(
		(hash) => {
			existingUser.pwd = hash;

			existingUser.save().then(
				() => {
					res.status(201).json({message: 'PasswordReset: password reset!'});
				}
			).catch(
				() => {
					const err = new HttpError(
						'PasswordReset: could not update user.',
						500
					);
					return next(err);				}
			);
		}
	);

}

exports.startPasswordReset = startPasswordReset;
exports.endPasswordReset = endPasswordReset;