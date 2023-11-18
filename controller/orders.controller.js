const Order = require('../model/orders.model')
const Product = require('../model/product.model')
const Rating = require('../model/rating.model')
const Baker = require('../model/baker.model')
const { validationResult } = require("express-validator")


const addNewOrder = async (req,res,next)=>{
  const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({status: "fail",data :errors.array()})
    }
    try {
        const { productId, paymentMethod, collectionTime } = req.body;
    
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        const userId = req.currentUser.id;
    
        const newOrder = new Order({
          userId,
          productId,
          productName: product.name,
          paymentMethod,
          collectionTime,
          status: "placed",
          baker: product.baker
        });
    
        await newOrder.save();
    
        res.status(201).json({ message: 'Order placed successfully', data: {
          newOrder: {
            productName: newOrder.productName,
            paymentMethod: newOrder.paymentMethod,
            collectionTime: newOrder.collectionTime,
            status: newOrder.status,
            baker: newOrder.baker,
          }} });
      } catch (error) {
        if (error.name === 'ValidationError') {
          return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.log(error)
    
        res.status(500).json({ error: 'Error placing the order' ,error });
      }
    };

    const getBakersOrders = async (req, res) => {
      try {
        const { role, id ,name} = req.currentUser;
    
        if (role === 'customer') {
          const customerOrders = await Order.find({ 'userId': id }, { "userId": false, "productId": false,"__v": false });
          res.status(200).json({ orders: customerOrders });
        } else if (role === 'baker') {
          const bakerOrders = await Order.find({ 'baker': name }, { "userId": false, "__v": false,"productId": false });
          res.status(200).json({ orders: bakerOrders });
        } else {
          res.status(403).json({ message: 'Access denied' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
};

const acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndUpdate(orderId, { status: 'Accepted' }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order accepted successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const rejectOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndUpdate(orderId, { status: 'Rejected' }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order rejected successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const fulfillOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndUpdate(orderId, { status: 'Fulfilled' }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order fulfilled successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addRating = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { ratingValue } = req.body;
    const userId = req.currentUser.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Fulfilled') {
      return res.status(400).json({ message: 'Order must be fulfilled before rating' });
    }

    if (order.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied. You are not authorized to rate this product.' });
    }

    if (ratingValue < 0 || ratingValue > 5) { // Changed variable name to ratingValue
      return res.status(400).json({ status: 'error', msg: 'Invalid rating. Rating must be between 0 and 5.' });
    }

    const rating = new Rating({
      orderId,
      userId,
      ratingValue,
      baker: order.baker,
      productName: order.productName
    });

    rating.save();

    const baker = await Baker.findOne({ name: order.baker });
    const totalRating = (baker.rating * baker.totalRatings) + ratingValue;
    baker.totalRatings += 1;
    baker.rating = totalRating / baker.totalRatings;
    await baker.save();

    res.json({ status: 'success', data: { baker: { name: baker.name, location: baker.location, rating: baker.rating } } });
  } catch (error) {
    res.status(500).json({ status: 'error', msg: error.message });
  }
};



module.exports = {
    addNewOrder,
    getBakersOrders,
    acceptOrder,
    rejectOrder,
    fulfillOrder,
    addRating
}