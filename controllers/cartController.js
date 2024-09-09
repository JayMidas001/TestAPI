const Cart = require('../models/cartModel');
const productModel = require('../models/productModel');
const session = require(`express-session`)

// Utility function to initialize or retrieve a session-based cart
const getSessionCart = (req) => {
    if (!req.session.cart) {
        req.session.cart = {
            items: [],
            totalPrice: 0
        };
    }
    return req.session.cart;
};

// Add an item to the cart (works for both guests and authenticated users)
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user ? req.user._id : null; // Check if user is authenticated
        console.log(req.session); // For debugging purposes

        // Find the product to add
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart;
        if (userId) {
            // Authenticated user: use database cart
            cart = await Cart.findOne({ user: userId });
            if (!cart) {
                cart = new Cart({ user: userId, items: [] });
            }
        } else {
            // Guest user: use session-based cart
            const getSessionCart = (req) => {
              if (!req.session.cart) {
                  req.session.cart = {
                      items: [],
                      totalPrice: 0
                  };
              }
              return req.session.cart;
          };
            cart = getSessionCart(req);
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
              productImage: product.productImage,
              merchant: product.merchant
            });
        }

        // Recalculate the total price
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);

        if (userId) {
            // Save the cart for authenticated users
            await cart.save();
        } else {
            // Update session-based cart for guests
            req.session.cart = cart;
        }

        res.status(200).json({
            message: "Item added to cart successfully",
            data: cart
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View cart items (works for both guests and authenticated users)
const viewCart = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;

        let cart;
        if (userId) {
            // Authenticated user: use database cart
            cart = await Cart.findOne({ user: userId }).populate('items.product');
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }
        } else {
            // Guest user: use session-based cart
            cart = getSessionCart(req);
        }

        res.status(200).json({
            message: "Cart retrieved successfully",
            data: cart
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove an item from the cart (works for both guests and authenticated users)
const removeItemFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user ? req.user._id : null;

        let cart;
        if (userId) {
            // Authenticated user: use database cart
            cart = await Cart.findOne({ user: userId });
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }
        } else {
            // Guest user: use session-based cart
            cart = getSessionCart(req);
        }

        // Find the index of the item to update
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // Get the item
            const item = cart.items[itemIndex];

            // Check if the quantity is greater than 1
            if (item.quantity > 1) {
                // Reduce quantity by 1
                cart.items[itemIndex].quantity -= 1;
            } else {
                // If the quantity is 1, remove the item entirely
                cart.items.splice(itemIndex, 1);
            }

            // Recalculate the total price
            cart.totalPrice = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);

            if (userId) {
                // Save the cart for authenticated users
                await cart.save();
            } else {
                // Update session-based cart for guests
                req.session.cart = cart;
            }

            res.status(200).json({
                message: item.quantity > 0 ? "Item quantity reduced by one" : "Item removed from cart",
                data: cart
            });
        } else {
            res.status(404).json({ message: "Item not found in cart" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const reduceItemQty = async (req, res) => {
        try {
          const { userId } = req.user;
          const { productId } = req.body;
      
          if (!productId) {
            return res.status(400).json({ error: 'Menu Item Id required' });
          }
      
          const user = await userModel.findById(userId);
          const product = await productModel.findById(productId);
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
      

// Clear the cart (works for both guests and authenticated users)
const clearCart = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;

        let cart;
        if (userId) {
            // Authenticated user: use database cart
            cart = await Cart.findOne({ user: userId });
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }
            cart.items = [];
            cart.totalPrice = 0;
            await cart.save();
        } else {
            // Guest user: clear session-based cart
            cart = getSessionCart(req);
            cart.items = [];
            cart.totalPrice = 0;
            req.session.cart = cart;
        }

        res.status(200).json({
            message: "Cart cleared successfully",
            data: cart
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addToCart,
    viewCart,
    removeItemFromCart,
    reduceItemQty,
    clearCart
}