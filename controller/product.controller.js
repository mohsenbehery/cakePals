const Product = require('../model/product.model')
const { validationResult } = require("express-validator")

const getAllProduct = async (req, res) => {
    try {
      const { type } = req.query;

      const query = {};
      if (type) {
        query.type = type;
      }
  
      const products = await Product.find(query);
  
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving products' });
    }
  };

const addNewProduct = async (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({status: "fail",data :errors.array()})
    }

    try {
        const newProduct = new Product(req.body)
        newProduct.baker = req.currentUser.name

        await newProduct.save()
        res.json({status: "success",data: newProduct})
    } catch (err){
        res.status(500).json({ status: "ERROR", msg: "An error occurred while adding the product." });
    }
}

const deleteProduct = async (req,res,next)=>{
    const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    if (product.baker !== req.currentUser.name) {
        return res.status(403).json({ error: 'Access denied. You are not authorized to delete this product.' });
    }

    await product.deleteOne();

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the product' });
  }
}

const updateProduct = async (req,res,next)=>{
    const { productId } = req.params;
    const updatedFields = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    if (product.baker !== req.currentUser.name) {
        return res.status(403).json({ error: 'Access denied. You are not authorized to delete this product.' });
    }
    await Product.updateOne({_id: productId},updatedFields)
    
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating the product' });
  }
}


module.exports = {
    getAllProduct,
    addNewProduct,
    deleteProduct,
    updateProduct,
}