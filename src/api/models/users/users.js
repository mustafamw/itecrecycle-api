const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');
const bcrypt = require('bcryptjs');
const config = require('../../../config/config');
const { UsersRolesModel } = require('../usersRoles/usersRoles');
const { RolesModel } = require('../roles/roles');
const { CustomersModel } = require('../customers/customers');

const UsersModel = sequelize.define(
  'users', {
    userId: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      field: 'user_id',
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
      async beforeCreate(user) {
        const data = user;
        data.password = await bcrypt.hash(user.password, config.bcrypt.salt);
        data.email = user.email.toLowerCase();
        return data;
      },
      async beforeUpdate(user) {
        const data = user;
        data.password = await bcrypt.hash(user.password, config.bcrypt.salt);
        return data;
      },
    },
    tableName: 'users',
  },
);

UsersModel.belongsToMany(RolesModel, {
  through: UsersRolesModel,
});

UsersModel.hasOne(CustomersModel);

module.exports = {
  UsersModel,
};
