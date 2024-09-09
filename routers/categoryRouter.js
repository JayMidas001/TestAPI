const express = require(`express`)
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require("../controllers/categoryController")
const { isSuperAdmin } = require("../middlewares/Auth")
const router = express.Router()


router.post(`/create-category`, isSuperAdmin, createCategory)

router.get(`/getallcategories`, getAllCategories)

router.get(`/getonecategory/:categoryId`, getCategoryById)

router.put(`/updatecategory/:categoryId`, isSuperAdmin, updateCategory)

router.delete(`/deletecategory/:categoryId`, isSuperAdmin, deleteCategory)

module.exports = router