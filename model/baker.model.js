const mongoose = require ('mongoose')
const validator = require('validator')
const User = require('./user.model')

const bakerSchema = mongoose.Schema({
    location: {
        type: String,
    },
    collectionTimeRange:{
        type: String,
        default: "10:00am-8:00pm"
    },
    role: {
        type: String,
        default: "baker"
    },
    rating: {
        type: Number,
        delete: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    }
})

module.exports = User.discriminator('baker',bakerSchema)