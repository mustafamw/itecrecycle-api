const joi = require('joi');

const schema = {
  contactUs: {
    body: joi.object().keys({
      email: joi.string()
        .email()
        .min(1)
        .max(50)
        .required(),
      subject: joi.string()
        .min(7)
        .max(150)
        .required(),
      message: joi.string()
        .min(7)
        .max(250)
        .required(),
    })
      .unknown(false),
  },
};

module.exports = schema;
