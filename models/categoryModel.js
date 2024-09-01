const mongoose = require(`mongoose`)

const categorySchema = new mongoose.Schema({
    categoryName:{
        type: String,
        require: true
    },
    categoryDescription:{
        type: String,
        require: true
    },
    categoryImage:{
        type: String,
        require: true
    },
    merchant:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Merchant"
    }],
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
}, {timestamps:true})

const productModel = mongoose.model(`Category`, categorySchema)

module.exports = productModel
