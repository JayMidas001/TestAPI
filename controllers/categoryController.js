const Category = require('../models/categoryModel');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

// Create a new category
const createCategory = async (req, res) => {
    try {
        const { categoryName, categoryDescription } = req.body;

        if (!categoryName || !categoryDescription) {
            return res.status(400).json({ message: "Please enter all fields." });
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: "No file was uploaded." });
        }

        const file = req.files.categoryImage;

        // Upload image to Cloudinary
        const image = await cloudinary.uploader.upload(file.tempFilePath);

        // Delete the uploaded file locally after uploading to Cloudinary
        fs.unlink(file.tempFilePath, (err) => {
            if (err) {
                console.log("Failed to delete the file locally:", err);
            }
        });

        const newCategory = new Category({
            categoryName,
            categoryDescription,
            categoryImage: image.secure_url // Store the Cloudinary URL
        });

        const savedCategory = await newCategory.save();

        res.status(201).json({
            message: "Category created successfully",
            data: savedCategory
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        res.status(200).json({
            message: "Categories retrieved successfully",
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId).populate('products');

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category retrieved successfully",
            data: category
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateCategory = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { categoryName, categoryDescription } = req.body;
      const file = req.files.categoryImage;
  
      // Check if category exists
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      // Update category fields
      data = {
      categoryName: categoryName || category.categoryName,
      categoryDescription : categoryDescription || category.categoryDescription
    }
      // Update category image if new file is uploaded
      if (file) {
        // Upload new image to Cloudinary
        const image = await cloudinary.uploader.upload(file.tempFilePath);
        // Delete previous image from Cloudinary
        await cloudinary.uploader.destroy(category.categoryImage);
        // Update category image URL
        category.categoryImage = image.secure_url;
      }
  
      // Save updated category
      const updatedCategory = await Category.findByIdAndUpdate(categoryId, data, { new: true });
      res.status(200).json({ message: "Category updated successfully", data: updatedCategory });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

const deleteCategory = async (req, res) => {
    try {
      const { categoryId } = req.params;
  
      const category = await Category.findByIdAndDelete(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      await cloudinary.uploader.destroy(category.categoryImage);
  
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
