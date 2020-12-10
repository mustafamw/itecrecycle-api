const joiBase = require('joi');
const joi = joiBase.extend(require('joi-jwt'));
const { environment } = require('../../../../environments/environment');

const {
  secret,
} = environment.jwt;

const schema = {
  itemsCollection: {
    headers: joi.object().keys({
      authorization: joi
        .jwt()
        .replace(/bearer /gi, '')
        .valid({ secret })
        .required(),
    }),
    body: joi.object().keys({
      computers: joi.number()
        .integer()
        .min(0)
        .required(),
      laptops: joi.number()
        .integer()
        .min(0)
        .required(),
      monitors: joi.number()
        .integer()
        .min(0)
        .required(),
      servers: joi.number()
        .integer()
        .min(0)
        .required(),
      networking: joi.number()
        .integer()
        .min(0)
        .required(),
      hardDrive: joi.number()
        .integer()
        .min(0)
        .required(),
      mobilePhones: joi.number()
        .integer()
        .min(0)
        .required(),
      landlinePhones: joi.number()
        .integer()
        .min(0)
        .required(),
      tablets: joi.number()
        .integer()
        .min(0)
        .required(),
      printers: joi.number()
        .integer()
        .min(0)
        .required(),
      others: joi.string()
        .min(0)
        .max(250),
    }).unknown(false),
  },
};

module.exports = schema;
