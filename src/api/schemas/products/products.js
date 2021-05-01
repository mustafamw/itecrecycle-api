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
  productCreate: {
    headers: {
      authorization: joi
        .jwt()
        .replace(/bearer /gi, '')
        .valid({ secret })
        .required(),
    },
    // body: joi.object().keys({
    //   title: joi.string()
    //     .min(1)
    //     .max(50)
    //     .required(),
    //   description: joi.string()
    //     .min(1)
    //     .max(50)
    //     .required(),
    //   // image: joi.string()
    //   //   .min(1)
    //   //   .max(20)
    //   //   .required(),
    //   price: joi.number()
    //     .required(),
    //   stock: joi.number()
    //     .min(1)
    //     .required(),
    // }).unknown(false),
  }
};

module.exports = schema;
