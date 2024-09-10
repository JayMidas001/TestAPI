const express = require(`express`)
const { addToCart, viewCart, clearCart, removeItemFromCart } = require("../controllers/cartController")
const router = express.Router()


router.post(`/addtocart`, addToCart)

router.get(`/viewcart`, viewCart)

router.delete(`/removeitem`, removeItemFromCart)

router.delete(`/clearcart`, clearCart)

module.exports = router