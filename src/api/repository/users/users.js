const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const {
  RolesModel,
} = require('../../models/roles/roles');
const {
  UsersModel,
} = require('../../models/users/users');
const {
  UsersRolesModel,
} = require('../../models/usersRoles/usersRoles');
const {
  CustomersModel,
} = require('../../models/customers/customers');
const { NOT_FOUND, NOT_IMPLEMENTED } = require('http-status');
const { isEmpty } = require('lodash');
const { dataResponse } = require('../../utils/dataResponse');


const unauthorized = (message) => {
  throw new APIError({
    status: httpStatus.UNAUTHORIZED,
    message,
  });
};

exports.getUserDetails = async (payload) => {
  const {
    email = null,
    userId = null,
  } = payload;
  const data = await UsersModel.findOne({
    attributes: ['userId', 'email', 'password', 'active'],
    where: {
      [Op.or]: [
        { email },
        { userId },
      ],
    },
    include: [
      {
        attributes: ['roleCode'],
        model: RolesModel,
        through: {
          attributes: [],
        },
        required: false,
      },
      {
        model: CustomersModel,
        required: false,
      },
    ],
  });
  return data;
};

const checkEmailExist = async (payload) => {
  const errors = {};
  const data = await this.getUserDetails(payload);
  if (!data) {
    return;
  }
  if (payload.email.toLowerCase() === data.email) {
    errors.email = 'Already Taken';
  }
  if (!isEmpty(errors)) {
    throw new APIError({
      status: httpStatus.CONFLICT,
      errors,
    });
  }
};

const checkUserIsActive = async (payload) => {
  const {
    uid,
  } = payload;
  const data = await UsersModel.findByPk(uid, {
    attributes: ['active'],
  });
  if (!data) {
    throw new APIError({
      status: NOT_FOUND,
      message: 'Link no longer valid',
    });
  }
  if (data.active) {
    throw new APIError({
      status: httpStatus.CONFLICT,
      message: 'Your account is already activated',
    });
  }
  return;
};

const updateUserActive = async (payload) => {
  const {
    uid,
  } = payload;
  const data = await UsersModel.update(
    {
      active: true,
    },
    {
      where: {
        user_id: uid,
      },
    },
  );
  if (!data) {
    throw new APIError({
      status: NOT_FOUND,
    });
  }
  if (data[0] === 0) {
    throw new APIError({
      status: NOT_IMPLEMENTED,
    });
  }
  return dataResponse({ message: 'Your account is activated' });
};

const updateUserPassword = async (payload) => {
  const {
    uid,
    password,
  } = payload;
  const data = await UsersModel.update(
    {
      password,
    },
    {
      individualHooks: true,
      where: {
        user_id: uid,
      },
    },
  );
  if (!data) {
    throw new APIError({
      status: NOT_FOUND,
    });
  }
  if (data[0] === 0) {
    throw new APIError({
      status: NOT_IMPLEMENTED,
    });
  }
  return;
};

exports.signup = async (payload) => {
  await checkEmailExist(payload);
  const {
    userId,
    email,
  } = await UsersModel.create(payload);
  await CustomersModel.create({
    ...payload,
    userUserId: userId,
  });
  await UsersRolesModel.create({
    userUserId: userId,
    roleRoleId: 2,
  });
  return await this.getUserDetails({
    email,
  });
};

exports.login = async (payload) => {
  const {
    password,
  } = payload;
  const data = await this.getUserDetails(payload);
  if (data) {
    const valid = await bcrypt.compare(password, data.password);
    if (!data.active) {
      throw new APIError({
        status: httpStatus.FORBIDDEN,
        message: 'Please active your account',
      });
    }
    if (valid) {
      return data;
    }
    return unauthorized('Incorrect Login');
  }
  return unauthorized('Incorrect Login');
};

exports.activate = async (payload) => {
  await checkUserIsActive(payload);
  return await updateUserActive(payload);
};

exports.forgotPassword = async (payload) => {
  const data = await this.getUserDetails(payload);
  if (!data) {
    return false;
  }
  return data;
};

exports.resetPassword = async (headers, payload) => {
  const {
    uid,
  } = headers.authorization;
  const {
    password,
  } = payload;
  const data = await updateUserPassword({
    uid,
    password,
  });
  if (!data) {
    return false;
  }
  return data;
};

exports.resendActivation = async (payload) => {
  const data = await this.getUserDetails(payload);
  return data;
};
