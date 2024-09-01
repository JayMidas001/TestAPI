const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required : true
    },
    quantity: {
        type: Number,
        default: 1
    },
    savedForLater: {
        type: Boolean,
        default: false
    }
});

cartModel = mongoose.model(`Cart`, cartSchema)

module.exports = cartModel