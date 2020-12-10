const basketService = require('../../services/basket/basket');


exports.basket = async (req, res, next) => {
  try {
    const { authorization: jwtPayload } = req.headers;
    const { baskets } = req.body;
    const data = await basketService.basket(jwtPayload, baskets);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
