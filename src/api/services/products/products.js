const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
const logger = require('../../../config/logger');
const productRepository = require('../../repository/products/products');
const { currencyFormat } = require('../../utils/formatCurrency');
var fs = require('fs');
const axios = require('axios');
const { environment } = require('../../../../environments/environment');
const FormData = require('form-data');
const expressValidation = require('express-validation');
const error = require('../../middlewares/error');
const { getImageFormUrl } = require('../../utils/imageUrl');

exports.getProducts = async (pageNo) => {
  return await productRepository.getProducts(pageNo);
};

exports.getProductId = async (productId) => {
  return await productRepository.getProductId(productId);
};

const isProductIdsValid = (productIds, products) => {
  if (productIds.length !== products.length) {
    logger.info('ProductService:isProductsValid:info basket product id\'s does not match', productIds, products);
    throw new APIError({
      status: httpStatus.FORBIDDEN,
      message: 'Some products are no longer in stock, please select different products.',
    });
  }
};

const checkProductMatch = (baskets, productsById) => {
  let valid = true;
  const products = {};
  productsById.forEach((e) => {
    products[e.dataValues.productId] = e.dataValues;
  });
  let total = 0;
  baskets.forEach((basket) => {
    const product = products[basket.productId];
    product.quantity = basket.quantity;
    product.total = product.quantity * product.price;
    product.priceFormat = currencyFormat(product.price);
    product.totalFormat = currencyFormat(product.total);
    total += product.total;
    if (product.price !== basket.price ||
        !product.active ||
        (basket.quantity > product.stock)) {
      valid = false;
    }
  });
  if (!valid) {
    logger.info('ProductService:checkProductMatch:info invalid');
    throw new APIError({
      status: httpStatus.FORBIDDEN,
      message: 'Some products are no longer in stock, please select different products.',
    });
  }
  return {
    products: Object.values(products),
    total,
    totalFormat: currencyFormat(total),
  };
};

exports.isProductsValid = async (basket) => {
  const productIds = [];
  basket.forEach((e) => {
    productIds.push(e.productId);
  });
  const productsById = await productRepository.getProductsById(productIds);
  isProductIdsValid(productsById, productIds);
  return checkProductMatch(basket, productsById);
};

exports.createProduct = async (jwtClaim, payload, image) => {
  const { resources, host } = environment.express;
  const { roles } = jwtClaim;
  if (!roles.includes('admin')) {
    throw new APIError({
      status: httpStatus.UNAUTHORIZED,
    });
  }
  if (!image) {
    throw new expressValidation.ValidationError(
      error.imageRequired.errors,
      error.imageRequired.request
    )
  }
  const { destination, mimetype, path, size, filename } = image;
  const pathToFile = `${destination}/${filename}`;
  const pathImageurl = `${host}/data/uploads/${filename}`;
  const file = await getImageFormUrl(pathImageurl);
  const formData = new FormData();
  formData.append("image", file);
  const data = await axios.post(`${resources}/upload.php`, { a: 3 });
  console.log(data)
  // const { path: resourcesPath } = response;
  // payload.image = resourcesPath;
  // console.log(response)
  // const data = await productRepository.createProduct(payload);
  // if (fs.existsSync(pathToFile)) {
  //   fs.unlinkSync(pathToFile)
  // }
  // return data;
}
