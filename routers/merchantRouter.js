const express = require('express')
const { signUp, userLogin, verifyEmail, resendVerificationEmail, forgotPassword, changePassword, resetPassword, getOneUser, makeAdmin, userLogOut } = require('../controllers/merchantController')
const midasValidator = require('../middlewares/validator')

const router = express.Router()

router.post('/merchant-signup', midasValidator, signUp)

router.post(`/merchant-login`, midasValidator, userLogin)

router.get(`/merchant-verify/:token`, verifyEmail)

router.post(`/merchant-resendverification`, resendVerificationEmail)

router.post(`/merchant-forgotpassword`, forgotPassword)

router.post(`/merchant-changepassword/:token`, midasValidator, changePassword)

router.post(`/merchant-reset-password/:token`, resetPassword)

router.get(`/merchant-getone/:userId`, getOneUser)

router.post(`/merchant-logout`, userLogOut)

module.exports = router