const express = require(`express`)
const { authorize, isSuperAdmin} = require(`../middlewares/Auth`)
const { createProduct, getOneProduct, getAllForOneStore, getAllProducts, updateProduct, deleteProduct } = require("../controllers/productController")
const router = express.Router()

router.post(`/:merchantId/create-product/:categoryId`, createProduct)

router.get(`/getoneproduct/:productId`, getOneProduct)

router.get(`/allstoreproducts/:merchantId`, getAllForOneStore)

router.get(`/allproducts`, getAllProducts)

router.put(`/:merchantId/update-product/:productId`, updateProduct)

router.delete(`/delete-product/:productId`, authorize, deleteProduct)

module.exports = router