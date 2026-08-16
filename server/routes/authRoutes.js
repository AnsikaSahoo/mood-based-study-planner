const express = require('express');
const { register, login, logout, getProfile } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validations/authValidation');
const validate = require('../validations/validate');
const { protect } = require('../middleware/authMiddleware');
const AsyncHandler = require('../utils/AsyncHandler');

const router = express.Router();

router.post('/register', registerValidation, validate, AsyncHandler(register));
router.post('/login', loginValidation, validate, AsyncHandler(login));
router.post('/logout', protect, AsyncHandler(logout));
router.get('/profile', protect, AsyncHandler(getProfile));

module.exports = router;
