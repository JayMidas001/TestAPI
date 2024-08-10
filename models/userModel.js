const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    isVerified:{
        type:String
    },
    isAdmin:{
        type:String
    },
    blackList:[]
}, {timestamps: true})

const userModel = mongoose.model('User', userSchema);

module.exports = userModel