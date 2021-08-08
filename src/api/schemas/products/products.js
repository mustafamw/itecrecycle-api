const joiBase = require('joi');
const joi = joiBase.extend(require('joi-jwt'));
const { environment } = require('../../../../environments/environment');

const {
  secret,
} = environment.jwt;

const payload = {
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
};

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
  productDelete: {
    params: {
      productId: joi.number()
        .min(1)
        .required(),
    },
    headers: {
      authorization: joi
        .jwt()
        .replace(/bearer /gi, '')
        .valid({ secret })
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
    },
  },
  productPayload: {
    body: joi.object().keys({
      ...payload,
    }).unknown(false),
  },
};

schema.productUpdate = {
  body: joi.object().keys({
    productId: joi.number()
      .min(1)
      .required(),
    ...payload,
  }).unknown(false),
};

module.exports = schema;
