const joi = require('joi');

const schema = {
  products: {
    query: {
      pageNo: joi.number()
        .min(1),
    },
  },
  productId: {
    params: {
      productId: joi.number()
        .min(1)
        .required(),
    },
  },
};

module.exports = schema;
