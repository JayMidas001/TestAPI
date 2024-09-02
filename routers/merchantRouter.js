const express = require('express')
const upload = require("../utils/multer")
const { authorize, isSuperAdmin} = require(`../middlewares/Auth`)
const { signUp, userLogin, verifyEmail, resendVerificationEmail, forgotPassword, changePassword, resetPassword, getOneUser, makeAdmin, userLogOut, getAllMerchants, updateMerchant } = require('../controllers/merchantController')
const midasValidator = require('../middlewares/validator')
const router = express.Router()

router.post('/merchant-signup', midasValidator(false), upload.single('profileImage'), signUp)

router.post(`/merchant-login`, midasValidator(false), userLogin)

router.get(`/merchant-verify/:token`, verifyEmail)

router.post(`/merchant-resendverification`, midasValidator(false), resendVerificationEmail)

router.post(`/merchant-forgotpassword`, midasValidator(false), forgotPassword)

router.post(`/merchant-changepassword/:token`, midasValidator(false), changePassword)

router.post(`/merchant-reset-password/:token`, midasValidator(false), resetPassword)

router.put('/merchant-updateinfo', midasValidator(false), upload.single('profileImage'), updateMerchant)

router.get(`/merchant-getone/:userId`, getOneUser)

router.get(`/merchant-getall`, isSuperAdmin, getAllMerchants)

router.post(`/merchant-logout`, userLogOut)

module.exports = router