const Cart = require('../models/cartModel');
const productModel = require('../models/productModel');

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const {userId} = req.user

        // Find the cart associated with the user
        let cart = await Cart.findOne({ user: userId });

        // Find the product to add
        const product = await productModel.findById(productId);
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
}

const viewCart = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null; // Check if the user is authenticated
        const guestCart = req.body.guestCart; // Guest cart data sent from the client

        let cart;

        if (userId) {
            // **Authenticated User**: Fetch cart from the database
            cart = await Cart.findOne({ user: userId }).populate('items.product');
            if (!cart || cart.items.length === 0) {
                return res.status(404).json({ message: "Your cart is empty" });
            }
        } else {
            // **Guest User**: Use the guest cart provided by the client
            if (!guestCart || guestCart.items.length === 0) {
                return res.status(404).json({ message: "Your cart is empty" });
            }
            cart = guestCart;
        }

        res.status(200).json({
            message: "Cart retrieved successfully",
            data: cart
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const removeItemFromCart = async (req, res) => {
    try {
        const { productId, guestCart } = req.body;
        const userId = req.user ? req.user._id : null; // Check if the user is authenticated

        let cart;

        if (userId) {
            // **Authenticated User**: Fetch and update cart from the database
            cart = await Cart.findOne({ user: userId });
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }

            // Find the index of the item to remove
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (itemIndex > -1) {
                // Remove the item from the cart
                cart.items.splice(itemIndex, 1);

                // Recalculate the total price
                cart.totalPrice = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);

                // Save the updated cart
                await cart.save();

                return res.status(200).json({
                    message: "Item removed from cart successfully",
                    data: cart
                });
            } else {
                return res.status(404).json({ message: "Item not found in cart" });
            }

        } else {
            // **Guest User**: Update the guest cart provided by the client
            if (!guestCart || guestCart.items.length === 0) {
                return res.status(404).json({ message: "Cart is empty" });
            }

            // Find the index of the item to remove
            const itemIndex = guestCart.items.findIndex(item => item.product === productId);

            if (itemIndex > -1) {
                // Remove the item from the cart
                guestCart.items.splice(itemIndex, 1);

                // Recalculate the total price
                guestCart.totalPrice = guestCart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);

                return res.status(200).json({
                    message: "Item removed from cart successfully",
                    data: guestCart
                });
            } else {
                return res.status(404).json({ message: "Item not found in cart" });
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null; // Check if the user is authenticated
        const guestCart = req.body.guestCart; // Guest cart data sent from the client

        let cart;

        if (userId) {
            // **Authenticated User**: Fetch and clear the cart from the database
            cart = await Cart.findOne({ user: userId });
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }

            // Clear the cart items and reset totalPrice to 0
            cart.items = [];
            cart.totalPrice = 0;

            // Save the cleared cart
            await cart.save();
        } else {
            // **Guest User**: Clear the cart provided by the client
            if (!guestCart || guestCart.items.length === 0) {
                return res.status(404).json({ message: "Cart is already empty" });
            }

            // Clear the guest cart
            guestCart.items = [];
            guestCart.totalPrice = 0;

            // Send back the cleared guest cart
            cart = guestCart;
        }

        res.status(200).json({
            message: "Cart cleared successfully",
            data: cart,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { addToCart, viewCart, removeItemFromCart, clearCart}