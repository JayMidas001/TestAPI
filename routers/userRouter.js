const express = require('express')
const {
    userSignUp, verifyEmail, resendVerificationEmail, userLogin, resetPassword, forgotPassword, changePassword, makeAdmin, getOneUser, userLogOut
} = require('../controllers/userController')
const { signUpValidator, logInValidator } = require('../middlewares/validator')

const router = express.Router()

router.post('/sign-up', signUpValidator, userSignUp)

router.post(`/log-in`, logInValidator, userLogin)

router.get(`/verify/:token`, verifyEmail)

router.post(`/resend-verification`, resendVerificationEmail)

router.post(`/forgot-password`, forgotPassword)

router.post(`/change-password/:token`, changePassword)

router.post(`/reset-password/:token`, resetPassword)

router.get(`/getone/:userId`, getOneUser)

router.get(`/make-admin/:userId`, makeAdmin)

router.post(`/log-out`, userLogOut)

module.exports = router