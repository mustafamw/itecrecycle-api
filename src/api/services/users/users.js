const usersRepository = require('../../repository/users/users');
const user = require('../emails/user/user');
const {
  createToken,
  createActivateToken,
  createPasswordForgotToken,
} = require('../../utils/jwt');
const { dataResponse } = require('../../utils/dataResponse');

exports.signup = async (payload) => {
  const data = await usersRepository.signup(payload);
  const token = createActivateToken(data.dataValues);
  data.dataValues.token = token;
  await user.activate(data.dataValues);
  return dataResponse({ message: 'You have signed up successfully, we sent you an activation link. Check your email and click on the link to verify.' });
};

exports.login = async (payload) => {
  const data = await usersRepository.login(payload);
  const token = createToken(data);
  return { token };
};

exports.activate = async (payload) => {
  const data = await usersRepository.activate(payload);
  return data;
};

exports.forgotPassword = async (payload) => {
  const data = await usersRepository.forgotPassword(payload);
  if (data) {
    const token = createPasswordForgotToken(data);
    await user.forgotPassword({
      ...data,
      token,
    });
  }
  return dataResponse({ message: 'Password reset link has been sent to your email' });
};

exports.resetPassword = async (headers, payload) => {
  const data = await usersRepository.resetPassword(headers, payload);
  if (data) {
    await user.forgotPassword({
      ...data,
    });
  }
  return dataResponse({ message: 'Reset Password has been changed' });
};

exports.resendActivation = async (payload) => {
  const data = await usersRepository.resendActivation(payload);
  const message = dataResponse({ message: 'Your activation link has been sent to your email successfully.' });
  if (data && !data.active) {
    const token = createActivateToken(data);
    data.dataValues.token = token;
    await user.activate(data.dataValues);
    return message;
  }
  return message;
};
