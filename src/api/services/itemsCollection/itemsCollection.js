const itemsCollectionRepository = require('../../repository/itemsCollection/itemsCollection');
const usersRepository = require('../../repository/users/users');
const itemsCollection = require('../../services/emails/itemsCollection/itemsCollection');
const { dataResponse } = require('../../utils/dataResponse');

exports.itemsCollection = async (jwtPayload, payload) => {
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
};
