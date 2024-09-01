const mongoose = require(`mongoose`)

const productSchema = new mongoose.Schema({
    productName:{
        type: String,
        require: true
    },
    productDescription:{
        type: String,
        require: true
    },
    productImage:{
        type: String,
        require: true
    },
    merchant:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Merchant"
    }],
    categories:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }]
}, {timestamps:true})

const productModel = mongoose.model(`Product`, productSchema)

module.exports = productModel
