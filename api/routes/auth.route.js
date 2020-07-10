const express = require('express');
const { authController } = require('../controllers');
const router = express.Router();

router.route('/login').post(authController.login);
router.route('/signup').post(authController.register);
router.route('/forgotpassword').post(authController.forgotpassword);
router.route('/resetpassword').post(authController.resetpassword);

module.exports = { authRouter: router };
