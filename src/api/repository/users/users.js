const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
const logger = require('../../../config/logger');
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
  try {
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
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('UsersRepository:login:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
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
  try {
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
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('UsersRepository:checkUserIsActive:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

const updateUserActive = async (payload) => {
  try {
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
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('UsersRepository:updateUserActive:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

const updateUserPassword = async (payload) => {
  try {
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
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('UsersRepository:updateUserPassword:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.signup = async (payload) => {
  try {
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
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('UsersRepository:signup:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.login = async (payload) => {
  try {
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
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('UsersRepository:login:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.activate = async (payload) => {
  try {
    await checkUserIsActive(payload);
    return await updateUserActive(payload);
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('UsersRepository:activate:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.forgotPassword = async (payload) => {
  try {
    const data = await this.getUserDetails(payload);
    if (!data) {
      return false;
    }
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('UsersRepository:forgotPassword:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.resetPassword = async (headers, payload) => {
  try {
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
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('UsersRepository:forgotPassword:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.resendActivation = async (payload) => {
  try {
    const data = await this.getUserDetails(payload);
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('UsersRepository:resendActivation:error', error);
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};
