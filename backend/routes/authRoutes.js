const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { validateAuth } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

router.post('/signup', validateAuth('signup'), AuthController.signup);
router.post('/login', validateAuth('login'), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/forgot-password', validateAuth('forgotPassword'), AuthController.forgotPassword);
router.post('/reset-password', validateAuth('resetPassword'), AuthController.resetPassword);

module.exports = router;
