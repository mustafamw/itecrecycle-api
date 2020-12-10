const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');

const ContactUsModel = sequelize.define(
  'contact_us', {
    contactUsId: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      field: 'contact_us_id',
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING(250),
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
    timestamps: false,
    tableName: 'contact_us',
  },
);

module.exports = {
  ContactUsModel,
};
