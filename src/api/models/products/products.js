const { environment } = require('../../../../environments/environment');
const sequelize = require('../../../config/sequelize');
const { DataTypes } = require('sequelize');
const { forEach } = require('lodash');

const ProductsModel = sequelize.define(
  'products', {
    productId: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      field: 'product_id',
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(1000),
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
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    stock: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  },
  {
    hooks: {
      async afterFind(product) {
        const { resources } = environment.express;
        forEach(product, (e) => {
          e.image = `${resources}/${e.image}`;
        });
      },
    },
    tableName: 'products',
  },
);

module.exports = {
  ProductsModel,
};
