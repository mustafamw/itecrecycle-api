const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
const logger = require('../../../config/logger');
const { InvoicesModel } = require('../../models/invoices/invoices');
const { nanoid } = require('nanoid');
const productsRepository = require('../../repository/products/products');

exports.basket = async (jwtPayload, products) => {
  try {
    const userId = jwtPayload.uid;
    const referenceNo = nanoid(10).replace(/_/g, '').toUpperCase();
    products.forEach((e) => {
      e.userUserId = userId;
      e.productProductId = e.productId;
      e.referenceNo = referenceNo;
      delete e.productId;
    });
    await InvoicesModel.bulkCreate(products);
    await productsRepository.updateProductsStock(products);
    return { referenceNo };
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('BasketRepository:basket:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};
