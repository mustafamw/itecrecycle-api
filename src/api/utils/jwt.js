const jwt = require('jwt-simple');
const { environment } = require('../../../environments/environment');
const { getRoles } = require('./roles');
const moment = require('moment-timezone');

exports.createToken = (data) => {
  const {
    issuer,
    expire,
    secret,
    algorithm,
  } = environment.jwt;
  const currentDate = moment();
  const token = jwt.encode({
    uid: data.userId,
    iss: issuer,
    iat: currentDate.unix(),
    exp: currentDate.add(expire[0], expire[1]).unix(),
    roles: getRoles(data.roles),
  }, secret, algorithm);
  return token;
};

exports.createActivateToken = (data) => {
  const {
    issuer,
    expire,
    secretActivate,
    algorithm,
  } = environment.jwt;
  const currentDate = moment();
  const token = jwt.encode({
    uid: data.userId,
    iss: issuer,
    iat: currentDate.unix(),
    exp: currentDate.add(expire[0], expire[1]).unix(),
  }, secretActivate, algorithm);
  return token;
};

exports.createPasswordForgotToken = (data) => {
  const {
    issuer,
    expirePasswordForgot,
    secretPasswordForgot,
    algorithm,
  } = environment.jwt;
  const currentDate = moment();
  const token = jwt.encode({
    uid: data.userId,
    iss: issuer,
    iat: currentDate.unix(),
    exp: currentDate.add(expirePasswordForgot[0], expirePasswordForgot[1]).unix(),
  }, secretPasswordForgot, algorithm);
  return token;
};
