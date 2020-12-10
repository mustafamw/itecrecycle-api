const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');

const RolesModel = sequelize.define(
  'roles', {
    roleId: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      field: 'role_id',
    },
    roleName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'role_name',
    },
    roleCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'role_code',
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
    tableName: 'roles',
  },
);

module.exports = {
  RolesModel,
};
