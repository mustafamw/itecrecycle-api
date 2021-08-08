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

exports.createProduct = async (req, res, next) => {
  try {
    const { authorization: jwtClaim } = req.headers;
    const payload = req.body;
    const { file: image } = req;
    const data = await productService.createProduct(jwtClaim, payload, image);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { authorization: jwtClaim } = req.headers;
    const payload = req.body;
    const { file: image } = req;
    const data = await productService.updateProduct(jwtClaim, payload, image);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { authorization: jwtClaim } = req.headers;
    const data = await productService.deleteProduct(jwtClaim, productId);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

