const mongoose = require ('mongoose')


const ratingSchema = mongoose.Schema({
    orderId:{
      type: String,
      require: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      baker: String,
      productName: String,
      ratingValue: {
        type: Number,
        required: true,
      }
});
    
    
    

module.exports = mongoose.model('rating',ratingSchema)