const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
const logger = require('../../../config/logger');
const productRepository = require('../../repository/products/products');
const { currencyFormat } = require('../../utils/formatCurrency');
var fs = require('fs');
const axios = require('axios');
const { environment } = require('../../../../environments/environment');
const FormData = require('form-data');

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
  const { resources } = environment.express;
  const { roles } = jwtClaim;
  if (!roles.includes('admin')) {
    throw new APIError({
      status: httpStatus.UNAUTHORIZED,
    });
  }
  const { destination, mimetype, path, size, filename } = image;
  console.error(image)
  const pathToFile = `${destination}${filename}`;
  const formData = new FormData();
  formData.append("image", fs.createReadStream(pathToFile), filename);
  console.error(resources)
  const { data: response } = await axios.post(`${resources}/upload.php`, formData, {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
    }
  });
  console.error(response)
  const { path: resourcesPath } = response;
  payload.image = resourcesPath;
  const data = await productRepository.createProduct(payload);
  // if (fs.existsSync(pathToFile)) {
  //   fs.unlinkSync(pathToFile)
  // }
  return data;
}
