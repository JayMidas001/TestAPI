const express = require(`express`)
const { addToCart, viewCart, clearCart, removeFromCart, reduceItemQty } = require("../controllers/cartController")
const { authorize, authenticate } = require("../middlewares/Auth")
const router = express.Router()


router.post(`/addtocart`, authenticate, addToCart)

router.get(`/viewcart`, authenticate, viewCart)

router.delete(`/removeitem`, authenticate, removeFromCart)

router.delete(`/reducequantity`, authenticate, reduceItemQty)

router.delete(`/clearcart`, authenticate, clearCart)

module.exports = router