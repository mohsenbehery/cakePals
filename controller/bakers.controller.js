const Baker = require('../model/baker.model');
const Product = require('../model/product.model');

const getBakerProfile = async (req, res) => {
  try {
    const { bakerId } = req.params;

    const baker = await Baker.findById(bakerId).select('name location collectionTimeRange rating -_id -__t');

    if (!baker) {
      return res.status(404).json({ message: 'Baker not found' });
    }

    const products = await Product.find({ baker: baker.name })
      .select('name bakingTime type -_id');

    res.status(200).json({ baker, products });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {
    getBakerProfile
}