const config = require('../../../config/config');
const { dataResponse } = require('../../utils/dataResponse');
const pagination = require('../../utils/pagination');
const { Op } = require('sequelize');

const {
  ProductsModel,
} = require('../../models/products/products');

exports.getProducts = async (pageNo) => {
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
};

exports.getProductId = async (productId) => {
  const data = await ProductsModel.findOne({
    where: {
      productId,
      active: true,
    },
  });
  return dataResponse(data);
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
  await Promise.all(products.map(async (product) => {
    await ProductsModel.decrement(['stock'], { by: product.quantity, where: { productId: product.productProductId } });
  }));
};

exports.createProduct = payload => ProductsModel.create(payload);

exports.updateProduct = payload => ProductsModel.update(
  {
    ...payload,
  },
  {
    where: {
      productId: payload.productId,
    },
  },
);

exports.deleteProduct = productId => ProductsModel.destroy({
  where: {
    productId,
  },
});

