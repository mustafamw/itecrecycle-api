const contactUsRepository = require('../../repository/contactUs/contactUs');
const contactUs = require('../../services/emails/contactUs/contactUs');
const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
const { dataResponse } = require('../../utils/dataResponse');

exports.contactUs = async (payload) => {
  const data = await contactUsRepository.contactUs(payload);
  await contactUs.email(data);
  return dataResponse({ message: 'Your enquiry has been submitted successfully' });
};
