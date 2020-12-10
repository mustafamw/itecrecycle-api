const usersService = require('../../services/users/users');
const { dataResponse } = require('../../utils/dataResponse');

exports.signup = async (req, res, next) => {
  try {
    const { body } = req;
    const data = await usersService.signup(body);
    res.json(data);
  } catch (error) {
    next(error);
  }
};


exports.login = async (req, res, next) => {
  try {
    const { body } = req;
    const data = await usersService.login(body);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.activate = async (req, res, next) => {
  try {
    const { authorization: payload } = req.headers;
    const data = await usersService.activate(payload);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const data = await usersService.forgotPassword(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const data = await usersService.resetPassword(req.headers, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.resetPasswordValid = async (req, res, next) => {
  try {
    res.json(dataResponse({ message: 'Token is valid' }));
  } catch (error) {
    next(error);
  }
};

exports.resendActivation = async (req, res, next) => {
  try {
    const data = await usersService.resendActivation(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
