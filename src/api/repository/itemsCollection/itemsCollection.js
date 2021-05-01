const { ItemsCollectionModel } = require('../../models/itemsCollection/itemsCollection');

exports.itemsCollection = async (jwtPayload, payload) => {
  const data = await ItemsCollectionModel.create({
    ...payload,
    userUserId: jwtPayload.uid,
  });
  return data.dataValues;
};
