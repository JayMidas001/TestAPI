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
        type: String
    },
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
}, {timestamps:true})

const categoryModel = mongoose.model(`Category`, categorySchema)

module.exports = categoryModel
