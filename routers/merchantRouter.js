const express = require('express')
const upload = require("../utils/multer")
const { authorize, isSuperAdmin, authenticate} = require(`../middlewares/Auth`)
const { signUp, userLogin, verifyEmail, resendVerificationEmail, forgotPassword, changePassword, resetPassword, getAllMerchants, updateMerchant, getOneMerchant, merchantLogOut } = require('../controllers/merchantController')
const midasValidator = require('../middlewares/validator')
const authenticateUser = require('../middlewares/auth2')
const { getMerchantOrders } = require('../controllers/orderController')
const router = express.Router()

router.post('/merchant-signup', midasValidator(false), upload.single('profileImage'), signUp)

router.post(`/merchant-login`, midasValidator(false), userLogin)

router.get(`/merchant-verify/:token`, verifyEmail)

router.post(`/merchant-resendverification`, midasValidator(false), resendVerificationEmail)

router.post(`/merchant-forgotpassword`, midasValidator(false), forgotPassword)

router.post(`/merchant-changepassword/:token`, midasValidator(false), changePassword)

router.post(`/merchant-reset-password/:token`, midasValidator(false), resetPassword)

router.put('/merchant-updateinfo/:merchantId', midasValidator(false), upload.single('profileImage'), authorize, updateMerchant)

router.get(`/merchant-getone/:merchantId`, getOneMerchant)

router.get(`/orders-received`, authorize, getMerchantOrders)

router.get(`/merchant-getall`, isSuperAdmin, getAllMerchants)

router.post(`/merchant-logout`, merchantLogOut)

module.exports = router