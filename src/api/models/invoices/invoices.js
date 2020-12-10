const sequelize = require('../../../config/sequelize');
const { DataTypes } = require('sequelize');
const { UsersModel } = require('../users/users');
const { ProductsModel } = require('../products/products');

const InvoicesModel = sequelize.define(
  'invoice', {
    invoiceId: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      field: 'invoice_id',
    },
    referenceNo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'reference_no',
    },
    productProductId: {
      type: DataTypes.INTEGER,
      field: 'product_id',
      references: {
        model: ProductsModel,
        key: 'product_id',
      },
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    userUserId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      references: {
        model: UsersModel,
        key: 'user_id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  });

module.exports = {
  InvoicesModel,
};
