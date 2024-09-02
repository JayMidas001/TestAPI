const express = require(`express`)
const upload = require("../utils/multer")
const { authorize, isSuperAdmin} = require(`../middlewares/Auth`)
const { createProduct, getOneProduct, getAllForOneStore, getAllProducts, updateProduct, deleteProduct } = require("../controllers/productController")
const router = express.Router()

router.post(`create-product`, authorize, upload.single('productImage'), createProduct)

router.get(`oneproduct`, getOneProduct)

router.get(`allstoreproducts`, getAllForOneStore)

router.get(`allproducts`, isSuperAdmin, getAllProducts)

router.put(`update-product/:productId`, authorize, upload.single('productImage'), updateProduct)

router.delete(`delete-product/:productId`, authorize, deleteProduct)

module.exports = router