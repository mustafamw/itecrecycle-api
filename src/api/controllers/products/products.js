const productService = require('../../services/products/products');
var multer  = require('multer')
var upload = multer({ dest: './public/data/uploads/' })

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

