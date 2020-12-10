const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');
const { UsersModel } = require('../users/users');

const CustomersModel = sequelize.define(
  'customers', {
    customerId: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      field: 'customer_id',
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'last_name',
    },
    telephoneNo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'telephone_no',
    },
    mobileNo: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'mobile_no',
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
    tableName: 'customers',
  },
);

module.exports = {
  CustomersModel,
};
