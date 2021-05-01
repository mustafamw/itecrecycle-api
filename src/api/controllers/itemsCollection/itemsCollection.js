const itemsCollectionService = require('../../services/itemsCollection/itemsCollection');

exports.itemsCollection = async (req, res, next) => {
  try {
    const { authorization: jwtPayload } = req.headers;
    const data = await itemsCollectionService.itemsCollection(jwtPayload, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
