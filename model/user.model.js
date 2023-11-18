const mongoose = require ('mongoose')
const validator = require('validator')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true,
        validate: [validator.isEmail,'invalid email address']
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: "customer"
    },
    token: {
        type: String
    }
})

module.exports = mongoose.model('user',userSchema)