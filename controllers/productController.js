const merchantModel = require(`../models/merchantModel`)
const categoryModel = require(`../models/categoryModel`)
const productModel = require(`../models/productModel`)
const cloudinary = require(`../utils/cloudinary`)
const fs = require(`fs`)
const path = require('path');


const createProduct = async (req, res) => {
    try {
      const { productName, itemPrice, itemDescription } = req.body;
      if (!productName || !itemPrice || !itemDescription) {
        return res.status(400).json({ message: "Please enter all fields." });
      }
      const {merchantId} = req.params
      const merchantStore = await merchantModel.findById(merchantId);
      if (!merchantStore) {
        return res.status(401).json("Store is not currently online.");
      }
      const {categoryId} = req.params
      const productCategory = await categoryModel.findById(categoryId);
      if (!productCategory) {
        return res.status(401).json("Category not found.");
      }
      // Upload image to cloudinary
      const file = req.file.path
      const image = await cloudinary.uploader.upload(file)
  
      // create a new product item
      const newProduct = await productModel.create({
            merchant: merchantId,
            productName,
            merchantName: merchantStore.businessName,
            merchantDescription: merchantStore.description,
            itemPrice, 
            itemDescription,
            category: categoryId,
            productImage: image.secure_url,
      });
  
      // ensure the product is added to the category under the merchant
      merchantStore.products.push(newProduct._id);
    productCategory.products.push(newProduct._id);
  
      // Save the updated restaurant with the new menu item
      await merchantStore.save();
      await productCategory.save();
  
      res.status(201).json({
        message: "New Product created successfully.",
        data: newProduct
      });
    } catch (error) {
      res.status(404).json(error.message);
    }
  };
  

  const getOneProduct = async (req, res)=>{
    try {
        const {productId} = req.params;
        const product = await productModel.findById(productId).populate('categories')
        if (!product) {
            return res.status(404).json('Product not found.');
        }
        res.status(200).json({
            message: `Product found`,
            data: product
        });
      } catch (error) {
        res.status(500).json(error.message);
      }
};


const getAllForOneStore = async (req, res) => {
    try {
        const {merchantId} = req.params
      const merchantStore = await merchantModel.findById(merchantId).populate('products');
      if (!merchantStore) {
        return res.status(404).json("Store not found.");
      }
      res.status(200).json({
        message: `All products found.`,
        data: merchantStore
    });
    } catch (error) {
      res.status(500).json(error.message);
    }
}

const getAllProducts = async (req, res) => {
    try {
      const products = await productModel.find();
      if (products.length === 0) {
        return res.status(404).json("No products found.");
      }

      res.status(200).json({
        message:'Products found.',
        data: products
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
};


const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { productName, productDescription} = req.body;

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json(`Product not found.`);
        }

        const data = {
            productName: productName || product.productName,
            productDescription: productDescription || product.productDescription,
            productImage: product.productImage,
        };

        if (req.file) {
            const imagePublicId = product.productImage.split(`/`).pop().split(`.`)[0];
            await cloudinary.uploader.destroy(imagePublicId);  // Destroy old image
            const file = req.file
            const image = await cloudinary.uploader.upload(file.path)
            //const updateResponse = await cloudinary.uploader.upload(productImage); 
            data.productImage = image.secure_url;  // Update data with new image URL
        }

        const updatedProduct = await productModel.findByIdAndUpdate(productId, data, { new: true });

        res.status(200).json({
            message: 'Product info updated successfully',
            data: updatedProduct,
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const deleteProduct = async (req, res)=>{
    try {
        
        const {productId} = req.params
        const product = await productModel.findByIdAndDelete(productId)
        if(!product){
            return res.status(404).json(`Product not found.`)
        }
        const imagePublicId = product.productImage.split(`/`).pop().split(`.`)[0]
        await cloudinary.uploader.destroy(imagePublicId)

        const localFilePath = `uploads/${product.productImage}`;
            // Check if the file exists inside of the path
            if (fs.existsSync(localFilePath)) {
                // Delete the existing image
                fs.unlinkSync(localFilePath);
                // Update the data object
            }

        res.status(200).json({
            message: `Product deleted successfully.`
        })
    } catch (error) {
        res.status(500).json(error.message)
    }
}

module.exports = {createProduct, getOneProduct, getAllForOneStore, getAllProducts, updateProduct, deleteProduct}