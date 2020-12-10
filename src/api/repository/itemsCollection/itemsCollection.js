const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
const logger = require('../../../config/logger');
const { ItemsCollectionModel } = require('../../models/itemsCollection/itemsCollection');

exports.itemsCollection = async (jwtPayload, payload) => {
  try {
    const data = await ItemsCollectionModel.create({
      ...payload,
      userUserId: jwtPayload.uid,
    });
    return data.dataValues;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('ItemsCollectionRepository:itemsCollection:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};
