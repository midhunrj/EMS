
const express = require('express');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { loginValidation, registerValidation } = require('../middleware/validators');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', loginValidation, validate, authController.login);
router.post('/logout', protect, authController.logout);
router.post('/register', registerValidation, validate, authController.register);

module.exports = router;
