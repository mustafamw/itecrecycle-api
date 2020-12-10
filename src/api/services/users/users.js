const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
const logger = require('../../../config/logger');
const usersRepository = require('../../repository/users/users');
const user = require('../emails/user/user');
const {
  createToken,
  createActivateToken,
  createPasswordForgotToken,
} = require('../../utils/jwt');
const { dataResponse } = require('../../utils/dataResponse');

exports.signup = async (payload) => {
  try {
    const data = await usersRepository.signup(payload);
    const token = createActivateToken(data.dataValues);
    data.dataValues.token = token;
    await user.activate(data.dataValues);
    return dataResponse({ message: 'You have signed up successfully, we sent you an activation link. Check your email and click on the link to verify.' });
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('UsersService:signup:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.login = async (payload) => {
  try {
    const data = await usersRepository.login(payload);
    const token = createToken(data);
    return { token };
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('UsersService:login:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.activate = async (payload) => {
  try {
    const data = await usersRepository.activate(payload);
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('UsersService:activate:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.forgotPassword = async (payload) => {
  try {
    const data = await usersRepository.forgotPassword(payload);
    if (data) {
      const token = createPasswordForgotToken(data);
      await user.forgotPassword({
        ...data,
        token,
      });
    }
    return dataResponse({ message: 'Password reset link has been sent to your email' });
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('UsersService:forgotPassword:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.resetPassword = async (headers, payload) => {
  try {
    const data = await usersRepository.resetPassword(headers, payload);
    if (data) {
      await user.forgotPassword({
        ...data,
      });
    }
    return dataResponse({ message: 'Reset Password has been changed' });
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('UsersService:forgotPassword:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.resendActivation = async (payload) => {
  try {
    const data = await usersRepository.resendActivation(payload);
    const message = dataResponse({ message: 'Your activation link has been sent to your email successfully.' });
    if (data && !data.active) {
      const token = createActivateToken(data);
      data.dataValues.token = token;
      await user.activate(data.dataValues);
      return message;
    }
    return message;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('UsersService:forgotPassword:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};
