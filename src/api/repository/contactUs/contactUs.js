const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
const logger = require('../../../config/logger');
const { ContactUsModel } = require('../../models/contactUs/contactUs');

exports.contactUs = async (payload) => {
  try {
    const data = await ContactUsModel.create(payload);
    return data.dataValues;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('ContactUsRepository:contactUs:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};
