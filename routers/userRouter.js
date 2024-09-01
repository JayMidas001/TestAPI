const express = require('express')
const {
    userSignUp, verifyEmail, resendVerificationEmail, userLogin, resetPassword, forgotPassword, changePassword, makeAdmin, getOneUser, userLogOut
} = require('../controllers/userController')
const midasValidator = require('../middlewares/validator')

const router = express.Router()

router.post('/sign-up', midasValidator(false), userSignUp)

router.post(`/log-in`, midasValidator(false), userLogin)

router.get(`/verify/:token`, verifyEmail)

router.post(`/resend-verification`, resendVerificationEmail)

router.post(`/forgot-password`, forgotPassword)

router.post(`/change-password/:token`, midasValidator(false), changePassword)

router.post(`/reset-password/:token`, resetPassword)

router.get(`/getone/:userId`, getOneUser)

router.get(`/make-admin/:userId`, makeAdmin)

router.post(`/log-out`, userLogOut)

module.exports = router