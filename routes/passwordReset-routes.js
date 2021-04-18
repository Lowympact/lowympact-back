const express = require('express');
const { check } = require('express-validator');

const passwordResetControllers = require('../controllers/passwordReset-controllers');

const router = express.Router();

router.post('/start',passwordResetControllers.startPasswordReset);

router.post('/end',passwordResetControllers.endPasswordReset);

module.exports = router;