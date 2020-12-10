const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
const logger = require('../../../config/logger');
const productRepository = require('../../repository/products/products');
const { currencyFormat } = require('../../utils/formatCurrency');

exports.getProducts = async (pageNo) => {
  try {
    return await productRepository.getProducts(pageNo);
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('ProductService:getProducts:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.getProductId = async (productId) => {
  try {
    return await productRepository.getProductId(productId);
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('ProductService:getProducts:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
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
  try {
    const productIds = [];
    basket.forEach((e) => {
      productIds.push(e.productId);
    });
    const productsById = await productRepository.getProductsById(productIds);
    isProductIdsValid(productsById, productIds);
    return checkProductMatch(basket, productsById);
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('ProductService:isProductsValid:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

