const joiBase = require('joi');
const joi = joiBase.extend(require('joi-jwt'));
const { environment } = require('../../../../environments/environment');

const {
  secretActivate,
  secretPasswordForgot,
} = environment.jwt;

const schema = {
  signup: {
    body: joi.object().keys({
      email: joi.string()
        .email()
        .min(1)
        .max(50)
        .required(),
      password: joi.string()
        .min(7)
        .max(50)
        .required(),
      confirmPassword: joi.any()
        .valid(joi.ref('password'))
        .required()
        .options({ language: { any: { allowOnly: 'must match password' } } }),
      firstName: joi.string()
        .min(1)
        .max(50)
        .required(),
      lastName: joi.string()
        .min(1)
        .max(50)
        .required(),
      telephoneNo: joi.string()
        .min(1)
        .max(20)
        .required(),
      mobileNo: joi.string()
        .min(1)
        .max(20),
    }).unknown(false),
  },
  login: {
    body: joi.object().keys({
      email: joi.string()
        .email()
        .required(),
      password: joi.string()
        .min(1)
        .required(),
    }).unknown(false),
  },
  activate: {
    headers: joi.object().keys({
      authorization: joi
        .jwt()
        .replace(/bearer /gi, '')
        .valid({ secret: secretActivate })
        .required(),
    }),
  },
  forgotPassword: {
    body: joi.object().keys({
      email: joi.string()
        .email()
        .required(),
    })
      .unknown(false),
  },
  resetPassword: {
    headers: joi.object().keys({
      authorization: joi
        .jwt()
        .replace(/bearer /gi, '')
        .valid({ secret: secretPasswordForgot })
        .required(),
    }),
    body: joi.object().keys({
      password: joi.string()
        .min(1)
        .required(),
      confirmPassword: joi.any()
        .valid(joi.ref('password'))
        .required()
        .options({ language: { any: { allowOnly: 'must match password' } } }),
    })
      .unknown(false),
  },
  resetPasswordValid: {
    headers: joi.object().keys({
      authorization: joi
        .jwt()
        .replace(/bearer /gi, '')
        .valid({ secret: secretPasswordForgot })
        .required(),
    }),
  },
  resendActivation: {
    body: joi.object().keys({
      email: joi.string()
        .email()
        .required(),
    })
      .unknown(false),
  },
};

module.exports = schema;
