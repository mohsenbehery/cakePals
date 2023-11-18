const mongoose = require ('mongoose')


const producSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    bakingTime: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    baker: {
        type: String,
    }
})

module.exports = mongoose.model('product',producSchema)