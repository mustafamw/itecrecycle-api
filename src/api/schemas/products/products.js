const joiBase = require('joi');
const joi = joiBase.extend(require('joi-jwt'));
const { environment } = require('../../../../environments/environment');

const {
  secret,
} = environment.jwt;

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
  productAuth: {
    headers: {
      authorization: joi
        .jwt()
        .replace(/bearer /gi, '')
        .valid({ secret })
        .required(),
    }
  },
  productPayload: {
    body: joi.object().keys({
      title: joi.string()
        .min(1)
        .max(150)
        .required(),
      description: joi.string()
        .min(1)
        .max(1000)
        .required(),
      price: joi.number()
        .required(),
      stock: joi.number()
        .min(1)
        .required(),
    }).unknown(false),
  }
};

module.exports = schema;
