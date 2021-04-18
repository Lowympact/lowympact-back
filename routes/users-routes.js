const express = require('express');
const { check } = require('express-validator');

const usersControllers = require('../controllers/users-controllers');
const auth = require('../util/auth');
const router = express.Router();


// router.post('/', XXXX);

router.post('/signup',
[
		check('name').not().isEmpty(),
		check('firstname').not().isEmpty(),
		check('mail').normalizeEmail().isEmail(),
		check('pwd').isLength({ min: 8 })
	],
	usersControllers.signUp
);

router.get('/', auth.allowIfLoggedin, auth.grantAccess('readAllProfiles'), usersControllers.getUsers);

router.get('/:userId', auth.allowIfLoggedin, auth.grantAccess('readOwnProfile'), usersControllers.getUserById);

router.get('/infos/:userId', usersControllers.getUserInfosById);

router.post('/login', usersControllers.login);

router.post('/signup', usersControllers.signUp);

router.patch('/:userId', auth.allowIfLoggedin, auth.grantAccess('updateUser'), usersControllers.updateUser);

router.delete('/:userId', auth.allowIfLoggedin, auth.grantAccess('deleteUser'), usersControllers.deleteUser);

module.exports = router;