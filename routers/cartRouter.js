const express = require(`express`)
const { addToCart, viewCart, clearCart, reduceItemQty, removeItemFromCart } = require("../controllers/cartController")
const router = express.Router()


router.post(`/addtocart`, addToCart)

router.get(`/viewcart`, viewCart)

router.delete(`/removeitem`, removeItemFromCart)

router.delete(`/reducequantity`, reduceItemQty)

router.delete(`/clearcart`, clearCart)

module.exports = router