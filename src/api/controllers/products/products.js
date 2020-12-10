const productService = require('../../services/products/products');

exports.getProducts = async (req, res, next) => {
  try {
    const { pageNo = 1 } = req.query;
    const data = await productService.getProducts(pageNo);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getProductId = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const data = await productService.getProductId(productId);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
