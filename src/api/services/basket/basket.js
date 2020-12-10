const basketRepository = require('../../repository/basket/basket');
const usersRepository = require('../../repository/users/users');
const productService = require('../../services/products/products');
const invoice = require('../../services/emails/invoice/invoice');
const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
const { dataResponse } = require('../../utils/dataResponse');

exports.basket = async (jwtPayload, basket) => {
  try {
    const { products, total, totalFormat } = await productService.isProductsValid(basket);
    const { referenceNo } = await basketRepository.basket(jwtPayload, products);
    const userDetails = await usersRepository.getUserDetails({ userId: jwtPayload.uid });
    const data = {
      referenceNo,
      products,
      userDetails,
      total,
      totalFormat,
    };
    await invoice.email(data);
    await invoice.emailAdmin(data);
    return dataResponse({
      ...data,
      userDetails: {
        customer: data.userDetails.customer,
        email: data.userDetails.email,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};
