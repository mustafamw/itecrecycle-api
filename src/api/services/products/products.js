const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
const logger = require('../../../config/logger');
const productRepository = require('../../repository/products/products');
const { currencyFormat } = require('../../utils/formatCurrency');
const fs = require('fs');
const axios = require('axios');
const { environment } = require('../../../../environments/environment');
const expressValidation = require('express-validation');
const error = require('../../middlewares/error');
const { imageBase64 } = require('../../utils/imageBase64');

exports.getProducts = async pageNo => productRepository.getProducts(pageNo);

exports.getProductId = async productId => productRepository.getProductId(productId);

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
  const productIds = basket.map(e => e.productId);
  const productsById = await productRepository.getProductsById(productIds);
  isProductIdsValid(productsById, productIds);
  return checkProductMatch(basket, productsById);
};

exports.createProduct = async (jwtClaim, payload, image) => {
  const { mimetype, path, filename } = image;
  const { resources } = environment.express;
  const { roles } = jwtClaim;
  if (!roles.includes('admin')) {
    if (image && fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
    throw new APIError({
      status: httpStatus.UNAUTHORIZED,
    });
  }
  if (!image || !(mimetype && mimetype.match(/image/g))) {
    if (image && fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
    throw new expressValidation.ValidationError(
      error.imageRequired.errors,
      error.imageRequired.request,
    );
  }
  const base64 = imageBase64(path);
  const { data: resourceResponse } = await axios.post(`${resources}/upload.php`, {
    image: base64,
    name: filename,
  });
  const { path: resourcesPath } = resourceResponse;
  payload.image = resourcesPath;
  const data = await productRepository.createProduct(payload);
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
  return data;
};

exports.updateProduct = async (jwtClaim, productId, payload, image) => {
  const { mimetype, path, filename } = image || {};
  const { resources } = environment.express;
  const { roles } = jwtClaim;
  if (!roles.includes('admin')) {
    if (image && fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
    throw new APIError({
      status: httpStatus.UNAUTHORIZED,
    });
  }
  const { data } = await this.getProductId(productId);
  if (!data) {
    if (image && fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
    throw new APIError({
      status: httpStatus.NOT_FOUND,
      message: 'Product Id Invalid',
    });
  }
  if (mimetype && !(mimetype.match(/image/g))) {
    if (image && fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
    throw new expressValidation.ValidationError(
      error.imageRequired.errors,
      error.imageRequired.request,
    );
  }
  if (path) {
    const imageResources = data.image.replace(`${resources}/`, '');
    const base64 = imageBase64(path);
    const { data: resourceResponse } = await axios.post(`${resources}/upload-exist.php`, {
      image: base64,
      name: filename,
      imageResources,
    });
    const { path: resourcesPath } = resourceResponse;
    payload.image = resourcesPath;
  }
  await productRepository.updateProduct(productId, payload);
  if (path && fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
  return payload;
};

exports.deleteProduct = async (jwtClaim, productId) => {
  const { resources } = environment.express;
  const { roles } = jwtClaim;
  if (!roles.includes('admin')) {
    throw new APIError({
      status: httpStatus.UNAUTHORIZED,
    });
  }
  const { data } = await this.getProductId(productId);
  if (!data) {
    throw new APIError({
      status: httpStatus.NOT_FOUND,
      message: 'Product Id Invalid',
    });
  }
  const imageResources = data.image.replace(`${resources}/`, '');
  await axios.post(`${resources}/delete.php`, {
    imageResources,
  });
  await productRepository.deleteProduct(productId);
};
