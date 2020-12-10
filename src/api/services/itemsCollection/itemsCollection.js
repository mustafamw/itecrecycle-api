const itemsCollectionRepository = require('../../repository/itemsCollection/itemsCollection');
const usersRepository = require('../../repository/users/users');
const itemsCollection = require('../../services/emails/itemsCollection/itemsCollection');
const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
const { dataResponse } = require('../../utils/dataResponse');

exports.itemsCollection = async (jwtPayload, payload) => {
  try {
    const itemsCollectionDetails = await itemsCollectionRepository.itemsCollection(jwtPayload, payload);
    const userDetails = await usersRepository.getUserDetails({ userId: jwtPayload.uid });
    await itemsCollection.email({
      userDetails,
      itemsCollectionDetails,
    });
    await itemsCollection.emailAdmin({
      userDetails,
      itemsCollectionDetails,
    });
    return dataResponse({ message: 'Your Items Collection has been submitted successfully' });
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};
