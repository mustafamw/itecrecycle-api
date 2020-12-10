const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
const logger = require('../../../config/logger');
const config = require('../../../config/config');
const { dataResponse } = require('../../utils/dataResponse');
const pagination = require('../../utils/pagination');
const { Op } = require('sequelize');

const {
  ProductsModel,
} = require('../../models/products/products');

exports.getProducts = async (pageNo) => {
  try {
    const { limit } = config.pagination;
    const offset = (pageNo - 1) * limit;
    const data = await ProductsModel.findAndCountAll({
      offset,
      limit,
      attributes: {
        exclude: ['description', 'createdAt', 'updatedAt'],
      },
      where: {
        active: true,
        stock: {
          [Op.gte]: 1,
        },
      },
    });
    return dataResponse(
      data.rows,
      pagination(pageNo, data.rows.length, data.count, limit),
    );
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('ProductRepository:getProducts:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.getProductId = async (productId) => {
  try {
    const data = await ProductsModel.findOne({
      where: {
        productId,
        active: true,
      },
    });
    if (data) {
      return dataResponse(data);
    }
    logger.info(`ProductRepository:getProductId:info not found productId:${productId}`);
    throw new APIError({
      status: httpStatus.NOT_FOUND,
      message: 'Page Not Found',
    });
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('ProductRepository:getProductId:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};


exports.getProductsById = async (productIds) => {
  const producs = await ProductsModel.findAll({
    where: {
      product_id: {
        [Op.in]: productIds,
      },
      active: true,
      stock: {
        [Op.gte]: 1,
      },
    },
  });
  return producs;
};


exports.updateProductsStock = async (products) => {
  try {
    await Promise.all(products.map(async (product) => {
      await ProductsModel.decrement(['stock'], { by: product.quantity, where: { productId: product.productProductId } });
    }));
  } catch (error) {
    logger.error('ProductRepository:updateProductsStock:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};
