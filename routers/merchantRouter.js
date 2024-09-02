const express = require('express')
const upload = require("../utils/multer")
const { signUp, userLogin, verifyEmail, resendVerificationEmail, forgotPassword, changePassword, resetPassword, getOneUser, makeAdmin, userLogOut } = require('../controllers/merchantController')
const midasValidator = require('../middlewares/validator')
const router = express.Router()

router.post('/merchant-signup', midasValidator(false), upload.single('profileImage'), signUp)

router.post(`/merchant-login`, midasValidator(false), userLogin)

router.get(`/merchant-verify/:token`, verifyEmail)

router.post(`/merchant-resendverification`, midasValidator(false), resendVerificationEmail)

router.post(`/merchant-forgotpassword`, midasValidator(false), forgotPassword)

router.post(`/merchant-changepassword/:token`, midasValidator(false), changePassword)

router.post(`/merchant-reset-password/:token`, midasValidator(false), resetPassword)

router.get(`/merchant-getone/:userId`, getOneUser)

router.post(`/merchant-logout`, userLogOut)

module.exports = router