const mongoose = require('mongoose');
const HttpError = require('../models/HttpError');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

/* GET */

const getUsers = async (req, res, next) => {
	let users;
	try{
		users = await User.find({}, '-pwd');
	} catch (err) {
		const error = new HttpError(
			'User: fetching users failed, please try again later.',
			500
		);
		return next(error);
	}

	res.json({users: users.map(user => user.toObject({ getters: true }))});
}

const getUserById = async (req, res, next) => {
	const userId = req.params.userId;
	let users;
	try{
		users = await User.findOne({ _id: userId},' -pwd');
	} catch (err) {
		const error = new HttpError(
			'User: fetching users failed, please try again later.',
			500
		);
		return next(error);
	}

	res.json(users);
}

const getUserInfosById = async (req, res, next) => {
	const userId = req.params.userId;

	let user;
	try {
		user = await User.findById(userId);
	} catch (err) {
		const error = new HttpError(
			'User: could not find the user.',
			500
		);
		return next(error);
	}

	res.json(user);
}


const login = async (req, res, next) => {
		User.findOne({ mail: req.body.mail }).then(
		  (user) => {
			if (!user) {
			  return res.status(401).json({
				error: new Error('User not found!')
			  });
			}
			bcrypt.compare(req.body.pwd, user.pwd).then(
				(valid) => {
					if (!valid) {
					  return res.status(401).json({
						error: new Error('Incorrect password!')
					  });
					}
					const token = jwt.sign(
						{ 
							userId: user._id,
							role: user.status,
						 },
						 'O{egv"r&10Dné@fqpmdjvLdQhM:A00;FyszeG)_vHuQ8)Ig0éz,ORbÀ&&FMn bRHAw.D_kj;lkjq`7$T=k-<~ia-@erQP153',
						{ expiresIn: '24h' }
					);
					res.status(200).json({
					  userId: user._id,
					  token: token,
					  role:user.status,
					});
				}
			).catch(
			  (error) => {
				res.status(500).json({
				  error: error
				});
			  }
			);
		  }
		).catch(
		  (error) => {
			res.status(500).json({
			  error: error
			});
		  }
		);
}


/* CREATE */

const signUp = async (req, res, next) => {

	const { name, firstname, mail, pwd, phone, status, places } = req.body;
	let existingUser;
	try {
		existingUser = await User.findOne({ mail: mail })
	} catch (err) {
		const error = new HttpError(
			'User: signing up failed, please try again later.',
			500
		);
		return next(error);
	}
	
	if (existingUser) {
		const error = new HttpError(
			'User exists already, please login instead.',
			422
		);
		return next(error);
	}

	
	bcrypt.hash(pwd, 10).then(
		(hash) => {
			const createdUser = new User({
				name,
				firstname,
				mail,
				pwd:hash,
				phone,
				status,
				places,
			});
		  createdUser.save().then(
			() => {
				res.status(201).json({user: createdUser.toObject({ getters: true })});
			}
		  ).catch(
			(error) => {
			  res.status(500).json({
				error: error
			  });
			}
		  );
		}
	  );
}

/* UPDATE */

const updateUser = async (req, res, next) => {
	const userId = req.params.userId;

	let user;
		try {
			user = await User.findById(userId);
		} catch (err) {
			const error = new HttpError(
				'User: could not find the user.',
				500
			);
			return next(error);
		}

		const {name, firstname, phone } = req.body;

		if(name != null) user.name = name;
		if(firstname != null) user.firstname = firstname;
		if(phone != null) user.phone = phone; 

		try {
			await user.save();
		} catch (err) {
			const error = new HttpError(
				'Bar: could not update the bar.',
				500
			);
			return next(error);
		}

		res.status(200).json({ user: user.toObject({ getters: true }) });
}


/* DELETE */

const deleteUser = async (req, res, next) => {
	const userId = req.params.userId;

		let user;
		try {
			user = await User.findByIdAndDelete(userId);
		} catch (err) {
			const error = new HttpError(
				'User: could not find the user.',
				500
			);
			return next(error);
		}

		res.status(200).json({ user: user.toObject({ getters: true }) });
}

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.getUserInfosById = getUserInfosById;
exports.login = login;
exports.signUp = signUp;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;