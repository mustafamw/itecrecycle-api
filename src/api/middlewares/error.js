const httpStatus = require('http-status');
const expressValidation = require('express-validation');
const APIError = require('../utils/APIError');
const { environment } = require('../../../environments/environment');
const logger = require('../../config/logger');

const { env } = environment.express;

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
const handler = (err, req, res, next) => {
  const response = {
    code: err.status,
    message: err.message || httpStatus[err.status],
    errors: err.errors,
    stack: err.stack,
  };

  if (env !== 'development') {
    delete response.stack;
  }
  logger.error(err.stack);
  console.error(err);
  res.status(err.status);
  res.json(response);
};
exports.handler = handler;

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
exports.converter = (err, req, res, next) => {
  let convertedError = err;

  if (err instanceof expressValidation.ValidationError) {
    convertedError = new APIError({
      message: 'Validation Error',
      errors: err.errors,
      status: err.status,
      stack: err.stack,
    });
  } else if (err.isAxiosError) {
    const { message, code } = err.response.data;
    convertedError = new APIError({
      message,
      status: code,
      stack: err.stack,
    });
  } else if (!(err instanceof APIError)) {
    convertedError = new APIError({
      message: err.message,
      status: err.status,
      stack: err.stack,
    });
  }

  return handler(convertedError, req, res);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.notFound = (req, res, next) => {
  const err = new APIError({
    message: 'Not found',
    status: httpStatus.NOT_FOUND,
  });
  return handler(err, req, res);
};

exports.imageRequired = {
  request: {
    status: httpStatus.BAD_REQUEST,
    statusText: 'Bad Request',
    message: 'Validation Error',
  },
  errors: [
    {
      field: 'image',
      location: 'body',
      messages: [
        '"image" is required',
      ],
      types: [
        'any.required',
      ],
    },
  ],
};
