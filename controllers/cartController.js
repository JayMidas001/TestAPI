const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const userModel = require(`../models/userModel`)

// Add an item to the cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const {userId} = req.user

        // Find the cart associated with the user
        let cart = await Cart.findOne({ user: userId });

        // Find the product to add
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // If the cart doesn't exist, create one
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [],
            });
        }

        // Check if the product already exists in the cart
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // If the product exists in the cart, update the quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            // If the product doesn't exist, add it to the cart
            cart.items.push({
                product: productId,
                productName: product.productName,
                quantity,
                price: product.productPrice,
                productImage: product.productImage
            });
        }
        // Recalculate the total price
        cart.calculateTotalPrice();

        // Save the cart
        await cart.save();

        res.status(200).json({
            message: "Item added to cart successfully",
            data: cart
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View cart items
exports.viewCart = async (req, res) => {
    try {
      const { userId } = req.user;
  
      // Check if the user exists
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }
  
      // Find the user's cart
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json({
          error: 'Cart not found'
        });
      }
      
  
      res.status(200).json(cart)
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: error.message
      });
    }
  }

// Remove an item from the cart
exports.removeFromCart = async (req, res) => {
    try {
      const { userId } = req.user;
      const { productId } = req.body;
  
      if (!productId) {
        return res.status(400).json({
          error: 'Menu Item Id required'
        });
      }
  
      // Check if the user and menu item exist
      const user = await userModel.findById(userId);
      const product = await Product.findById(productId);
  
      if (!user || !product) {
        return res.status(404).json({
          error: 'User or menu item not found'
        });
      }
  
      // Find the user's cart
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json({
          error: 'Cart not found'
        });
      }
  
      // Find the index of the item to remove
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (itemIndex > -1) {
          // Remove the item from the cart
          cart.items.splice(itemIndex, 1);

          // Recalculate the total price
          cart.calculateTotalPrice();

          // Save the updated cart
          await cart.save();

          res.status(200).json({
              message: "Item removed from cart successfully",
              data: cart
          });
      } else {
          res.status(404).json({ message: "Item not found in cart" });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
  };

  exports.reduceItemQty = async (req, res) => {
    try {
      const { userId } = req.user;
      const { productId } = req.body;
  
      if (!productId) {
        return res.status(400).json({ error: 'Menu Item Id required' });
      }
  
      const user = await userModel.findById(userId);
      const product = await Product.findById(productId);
      const cart = await Cart.findOne({ user: userId });
  
      if (!user || !product || !cart) {
        return res.status(404).json({ error: 'User, menu item or cart not found' });
      }
  
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  
      if (itemIndex > -1) {
        // Reduce the quantity of the product by one
        cart.items[itemIndex].quantity -= 1;
  
        // If the quantity reaches zero, remove the item from the cart
        if (cart.items[itemIndex].quantity === 0) {
          cart.items.splice(itemIndex, 1);
        }
  
        // Recalculate the total price
        cart.calculateTotalPrice();
  
        // Save the updated cart
        await cart.save();
  
        res.status(200).json({ message: "Item quantity reduced successfully", data: cart });
      } else {
        res.status(404).json({ message: "Item not found in cart" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
// Clear the cart
exports.clearCart = async (req, res) => {
    try {
      const { userId } = req.user;
  
      const cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      cart.items = [];

      cart.totalPrice = 0
  
      await cart.save();
  
      res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };