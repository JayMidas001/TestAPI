const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        price:{
            type: String,
            require: true
        },
        productImage:{
            type: String
        },
    }],
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    isCheckedOut: {
        type: Boolean,
        default: false
    },
    savedForLater: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

cartSchema.methods.calculateTotalPrice = function() {
    this.totalPrice = this.items.reduce((acc, item) => {
        return acc + item.quantity * item.price;
    }, 0);
    return this.totalPrice;
};

const cartModel = mongoose.model('Cart', cartSchema);

module.exports = cartModel;
