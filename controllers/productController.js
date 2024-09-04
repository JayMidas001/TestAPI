const merchantModel = require(`../models/merchantModel`);
const categoryModel = require(`../models/categoryModel`);
const productModel = require(`../models/productModel`);
const cloudinary = require(`../utils/cloudinary`);
const fs = require(`fs`);
const path = require('path');

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { productName, productPrice, productDescription } = req.body;
    const file = req.files.productImage;

    if (!productName || !productPrice || !productDescription) {
      return res.status(400).json({ message: "Please enter all fields." });
    }

    const { merchantId, categoryId } = req.params;
    const merchantStore = await merchantModel.findById(merchantId);
    const productCategory = await categoryModel.findById(categoryId);

    if (!merchantStore) {
      return res.status(401).json("Store is not currently online.");
    }

    if (!productCategory) {
      return res.status(401).json("Category not found.");
    }

    const image = await cloudinary.uploader.upload(file.tempFilePath);
    fs.unlink(file.tempFilePath, (err) => {
      if (err) {
        console.log("Failed to delete the file locally:", err);
      }
    });

    const newProduct = await productModel.create({
      merchant: merchantId,
      productName,
      merchantName: merchantStore.businessName,
      merchantDescription: merchantStore.description,
      productPrice,
      productDescription,
      categories: categoryId,
      productCategory: productCategory.categoryName,
      productImage: image.secure_url,
    });

    merchantStore.products.push(newProduct._id);
    productCategory.products.push(newProduct._id);

    await merchantStore.save();
    await productCategory.save();

    res.status(201).json({
      message: "New Product created successfully.",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
}; 

// Get a single product by ID
const getOneProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productModel.findById(productId).populate('categories');
    if (!product) {
      return res.status(404).json('Product not found.');
    }
    res.status(200).json({
      message: `Product found`,
      data: product,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }finally {
    // Always attempt to delete the temp file after upload
    if (req.files?.productImage?.tempFilePath) {
      fs.unlink(req.files.productImage.tempFilePath, (err) => {
        if (err) {
          console.log("Failed to delete the file locally:", err);
        }
      });
    }
  }
};

// Get all products for a specific store (merchant)
const getAllForOneStore = async (req, res) => {
  try {
    const { merchantId } = req.params;
    const merchantStore = await merchantModel.findById(merchantId).populate('products');
    if (!merchantStore) {
      return res.status(404).json("Store not found.");
    }
    res.status(200).json({
      message: `All products found.`,
      data: merchantStore.products, // Return only products
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find()
    if (products.length === 0) {
      return res.status(404).json("No products found.");
    }

    res.status(200).json({
      message: 'Products found.',
      data: products,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Update a product by ID

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { productName, productPrice, productDescription } = req.body;
    

    // Check if category exists
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
  
    // Update category fields
    data = {
    productName: productName || product.productName,
    productPrice : productPrice || product.productPrice,
    productDescription : productDescription || product.productDescription
  }
    // Update category image if new file is uploaded
    if (req.file) {
      // Upload new image to Cloudinary
      const image = await cloudinary.uploader.upload(req.files.productImage.tempFilePath);
      // Delete previous image from Cloudinary
      await cloudinary.uploader.destroy(product.productImage);
      // Update category image URL
      product.productImage = image.secure_url;
    }

    // Save updated category
    const updatedProduct = await productModel.findByIdAndUpdate(productId, data, { new: true });
    res.status(200).json({ message: "Category updated successfully", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productModel.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json("Product not found.");
    }

    const imagePublicId = product.productImage.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(imagePublicId);

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
module.exports = {
  createProduct,
  getOneProduct,
  getAllForOneStore,
  getAllProducts,
  updateProduct,
  deleteProduct,
};

// const Product = require('../models/productModel');
// const Category = require('../models/categoryModel');

// // Create a new product
// const createProduct = async (req, res) => {
//     try {
//         const { productName, productDescription, productImage, merchant, categories } = req.body;

//         // Check if the categories exist
//         const existingCategories = await Category.find({ _id: { $in: categories } });
//         if (existingCategories.length !== categories.length) {
//             return res.status(404).json({ message: "One or more categories not found." });
//         }

//         const newProduct = new Product({
//             productName,
//             productDescription,
//             productImage,
//             merchant,
//             categories
//         });

//         const savedProduct = await newProduct.save();

//         // Add product to each category
//         await Category.updateMany(
//             { _id: { $in: categories } },
//             { $push: { products: savedProduct._id } }
//         );

//         res.status(201).json({
//             message: "Product created successfully",
//             data: savedProduct
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         });
//     }
// };

// // Get all products
// const getAllProducts = async (req, res) => {
//     try {
//         const products = await Product.find()
//             .populate('merchant')
//             .populate('categories');

//         res.status(200).json({
//             message: "Products retrieved successfully",
//             data: products
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         });
//     }
// };

// // Get a single product by ID
// const getProductById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const product = await Product.findById(id)
//             .populate('merchant')
//             .populate('categories');

//         if (!product) {
//             return res.status(404).json({
//                 message: "Product not found"
//             });
//         }

//         res.status(200).json({
//             message: "Product retrieved successfully",
//             data: product
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         });
//     }
// };

// // Update a product by ID
// const updateProduct = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { categories } = req.body;

//         // If categories are being updated, check if they exist
//         if (categories) {
//             const existingCategories = await Category.find({ _id: { $in: categories } });
//             if (existingCategories.length !== categories.length) {
//                 return res.status(404).json({ message: "One or more categories not found." });
//             }
//         }

//         const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

//         if (!updatedProduct) {
//             return res.status(404).json({
//                 message: "Product not found"
//             });
//         }

//         res.status(200).json({
//             message: "Product updated successfully",
//             data: updatedProduct
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         });
//     }
// };

// // Delete a product by ID
// const deleteProduct = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const deletedProduct = await Product.findByIdAndDelete(id);

//         if (!deletedProduct) {
//             return res.status(404).json({
//                 message: "Product not found"
//             });
//         }

//         // Remove product reference from categories
//         await Category.updateMany(
//             { _id: { $in: deletedProduct.categories } },
//             { $pull: { products: deletedProduct._id } }
//         );

//         res.status(200).json({
//             message: "Product deleted successfully"
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         });
//     }
// };

// module.exports = {
//     createProduct,
//     getAllProducts,
//     getProductById,
//     updateProduct,
//     deleteProduct
// };
