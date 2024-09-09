const merchantModel = require(`../models/merchantModel`);
const categoryModel = require(`../models/categoryModel`);
const productModel = require(`../models/productModel`);
const userModel = require(`../models/userModel`)
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
      email: merchantStore.email
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

    // Find the product to delete
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json("Product not found.");
    }

    // Find the associated merchant and remove the product from their products list
    const merchantId = product.merchant;
    if (merchantId) {
      const merchant = await merchantModel.findById(merchantId);
      if (merchant) {
        // Remove the product's ObjectId from the merchant's products array
        merchant.products = merchant.products.filter(
          (prodId) => prodId.toString() !== productId
        );
        await merchant.save(); // Save the updated merchant
      }
    }

    // Delete the product
    await productModel.findByIdAndDelete(productId);

    // Delete the product image from Cloudinary
    const imagePublicId = product.productImage.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(imagePublicId);

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).json(error.message);
  }
};


const searchProducts = async (req, res) => {
    try {
        const { searchTerm } = req.body;

        if (!searchTerm) {
            return res.status(400).json({ message: "Please enter a search term" });
        }

        // Find products where the productName matches the search term (case-insensitive)
        const products = await productModel.find({
            productName: { $regex: searchTerm, $options: 'i' }
        });

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json({
            message: "Products retrieved successfully",
            data: products
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const saveProductForLater = async (req, res) => {
  try {
      const {userId} = req.user
      const productId = req.body.productId; 

      // Find the user
      const user = await userModel.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Find the product
      const product = await productModel.findById(productId);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      // Check if the product is already saved
      const isSaved = user.savedProducts.includes(productId);

      if (isSaved) {
          // If the product is already saved, unsave it (remove from list)
          user.savedProducts = user.savedProducts.filter(id => id.toString() !== productId);
      } else {
          // If not saved, add it to the savedProducts list
          user.savedProducts.push(productId);
      }

      // Save the updated user document
      await user.save();

      res.status(200).json({
          message: isSaved ? 'Product removed from saved list' : 'Product saved for later',
          savedProducts: user.savedProducts
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getOneProduct,
  getAllForOneStore,
  getAllProducts,
  updateProduct,
  deleteProduct,
  searchProducts,
  saveProductForLater,
};
