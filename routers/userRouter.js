const express = require('express')
const { isSuperAdmin, authenticate} = require(`../middlewares/Auth`)
const {
    userSignUp, verifyEmail, resendVerificationEmail, userLogin, resetPassword, forgotPassword, changePassword, makeAdmin, getOneUser, userLogOut,
    getAllUsers,
    makeSuperAdmin
} = require('../controllers/userController')
const midasValidator = require('../middlewares/validator')
const { checkout, confirmOrder, getAllOrders } = require('../controllers/orderController')
const authenticateUser = require('../middlewares/auth2')

const router = express.Router()

router.post('/sign-up', midasValidator(false), userSignUp)

router.post(`/log-in`, midasValidator(false), userLogin)

router.get(`/verify/:token`, verifyEmail)

router.post(`/resend-verification`, midasValidator(false), resendVerificationEmail)

router.post(`/forgot-password`, midasValidator(false), forgotPassword)

router.post(`/change-password/:token`, midasValidator(false), authenticate, changePassword)

router.post(`/reset-password/:token`, resetPassword)

router.get(`/make-admin/:userId`, makeAdmin)

router.get(`/make-super/:userId`, makeSuperAdmin)

router.get(`/getone/:userId`, getOneUser)

router.get(`/getallusers`, isSuperAdmin, getAllUsers)

router.get(`/checkout`, authenticateUser, checkout)

router.post(`/place-order`, midasValidator(false), authenticateUser, confirmOrder)

router.get(`/getorders`, authenticate, getAllOrders)

router.post(`/log-out`, userLogOut)

module.exports = router