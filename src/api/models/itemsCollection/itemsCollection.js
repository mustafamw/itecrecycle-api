const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');
const { UsersModel } = require('../users/users');

const ItemsCollectionModel = sequelize.define(
  'items_collection', {
    itemCollectionId: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      field: 'item_collection_id',
    },
    computers: {
      type: DataTypes.INET(11),
      allowNull: false,
    },
    laptops: {
      type: DataTypes.INET(11),
      allowNull: false,
    },
    monitors: {
      type: DataTypes.INET(11),
      allowNull: false,
    },
    servers: {
      type: DataTypes.INET(11),
      allowNull: false,
    },
    networking: {
      type: DataTypes.INET(11),
      allowNull: false,
    },
    hardDrive: {
      type: DataTypes.INET(11),
      allowNull: false,
    },
    mobilePhones: {
      type: DataTypes.INET(11),
      allowNull: false,
    },
    landlinePhones: {
      type: DataTypes.INET(11),
      allowNull: false,
    },
    tablets: {
      type: DataTypes.INET(11),
      allowNull: false,
    },
    printers: {
      type: DataTypes.INET(11),
      allowNull: false,
    },
    others: {
      type: DataTypes.STRING(250),
      allowNull: true,
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
  },
  {
    timestamps: false,
    tableName: 'items_collection',
  },
);

module.exports = {
  ItemsCollectionModel,
};
