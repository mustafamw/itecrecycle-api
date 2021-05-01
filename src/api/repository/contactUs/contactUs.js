const { ContactUsModel } = require('../../models/contactUs/contactUs');

exports.contactUs = async (payload) => {
  const data = await ContactUsModel.create(payload);
  return data.dataValues;
};
