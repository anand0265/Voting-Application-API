const express = require('express');
const { RegisterController, LoginController, updatePasswordController, getProfileController, resetPasswordController } = require('../controller/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Sign up
router.post('/register',RegisterController)
router.post('/login',LoginController)
router.post('/updatepassword',authMiddleware,updatePasswordController)
router.post('/resetpassword',authMiddleware,resetPasswordController)
router.get('/profile/:id',authMiddleware,getProfileController)

module.exports = router