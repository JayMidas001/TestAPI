const express = require(`express`)
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require("../controllers/categoryController")
const router = express.Router()


router.post(`/create-category`, createCategory)

router.get(`/getallcategories`, getAllCategories)

router.get(`/getonecategory/:categoryId`, getCategoryById)

router.put(`/updatecategory/:categoryId`, updateCategory)

router.delete(`/deletecategory/:categoryId`, deleteCategory)

module.exports = router