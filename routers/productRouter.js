const express = require(`express`)
const { createProduct, getOneProduct, getAllForOneStore, getAllProducts, updateProduct, deleteProduct } = require("../controllers/productController")
const router = express.Router()

router.post(`create-product`, createProduct)

router.get(`oneproduct`, getOneProduct)

router.get(`allstoreproducts`, getAllForOneStore)

router.get(`allproducts`, getAllProducts)

router.put(`update-product/:productId`, updateProduct)

router.delete(`delete-product/:productId`, deleteProduct)

module.exports = router