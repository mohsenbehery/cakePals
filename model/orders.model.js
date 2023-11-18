const mongoose = require ('mongoose')


const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true,
      },
      productName: String,
      paymentMethod: {
        type: String,
        required: true,
      },
      collectionTime: {
        type: String,
        required: true,
      },
      status: String,
      baker: String
    });

module.exports = mongoose.model('order',orderSchema)