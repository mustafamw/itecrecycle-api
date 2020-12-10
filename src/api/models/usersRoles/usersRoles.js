const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');
const { UsersModel } = require('../users/users');
const { RolesModel } = require('../roles/roles');

const UsersRolesModel = sequelize.define(
  'users_roles', {
    userRoleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'user_role_id',
    },
    userUserId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      references: {
        model: UsersModel,
        key: 'user_id',
      },
    },
    roleRoleId: {
      type: DataTypes.INTEGER,
      field: 'role_id',
      references: {
        model: RolesModel,
        key: 'role_id',
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
    tableName: 'users_roles',
  },
);

module.exports = {
  UsersRolesModel,
};
