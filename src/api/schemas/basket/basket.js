const joiBase = require('joi');
const joi = joiBase.extend(require('joi-jwt'));
const { environment } = require('../../../../environments/environment');

const {
  secret,
} = environment.jwt;

const schema = {
  book: {
    headers: {
      authorization: joi
        .jwt()
        .replace(/bearer /gi, '')
        .valid({ secret })
        .required(),
    },
    body: {
      basket: joi.array()
        .items(joi.object().keys({
          productId: joi.number()
            .min(1)
            .required(),
          title: joi.string()
            .min(1)
            .required(),
          description: joi.string()
            .min(1)
            .required(),
          image: joi.string()
            .min(1)
            .required(),
          price: joi.number()
            .min(1)
            .required(),
          active: joi.boolean()
            .required(),
          stock: joi.number()
            .min(1)
            .required(),
          quantity: joi.number()
            .min(1)
            .required(),
          createdAt: joi.string()
            .min(1)
            .required(),
          updatedAt: joi.string()
            .min(1)
            .required(),
        })
          .unknown(false))
        .min(1)
        .unique('productId'),
    },
  },
};

module.exports = schema;
