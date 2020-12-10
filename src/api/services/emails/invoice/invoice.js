const nodemailer = require('../../../../config/nodemailer');
const { environment } = require('../../../../../environments/environment');
const moment = require('moment-timezone');

exports.email = async ({
  referenceNo,
  products,
  userDetails,
  total,
  totalFormat,
}) => {
  const {
    userId,
    email,
  } = userDetails;
  const {
    customerId,
    firstName,
    lastName,
    telephoneNo,
    mobileNo,
  } = userDetails.customer;
  const data = {
    referenceNo,
    user: {
      userId,
      email,
      customer: {
        customerId,
        firstName,
        lastName,
        telephoneNo,
        mobileNo,
      },
    },
    products,
    total,
    totalFormat,
    currentDate: moment().format('DD/MM/YYYY'),
  };
  const {
    appName,
    domain,
    host,
  } = environment.express;
  const {
    email: emailSupport,
  } = environment.supportInfo;
  const mailOptions = {
    from: emailSupport,
    to: email,
    subject: `${appName} - Invoice`,
    template: 'layouts/invoice',
    context: {
      ...data,
      domain,
      host,
      emailSupport,
      year: new Date().getFullYear(),
      url: `${domain}/invoice`,
    },
  };
  await nodemailer(mailOptions);
};

exports.emailAdmin = async ({
  referenceNo,
  products,
  userDetails,
  total,
  totalFormat,
}) => {
  const {
    userId,
    email,
  } = userDetails;
  const {
    customerId,
    firstName,
    lastName,
    telephoneNo,
    mobileNo,
  } = userDetails.customer;
  const data = {
    referenceNo,
    user: {
      userId,
      email,
      customer: {
        customerId,
        firstName,
        lastName,
        telephoneNo,
        mobileNo,
      },
    },
    products,
    total,
    totalFormat,
    currentDate: moment().format('DD/MM/YYYY'),
  };
  const {
    appName,
    domain,
    host,
  } = environment.express;
  const {
    email: emailSupport,
  } = environment.supportInfo;
  const mailOptions = {
    from: emailSupport,
    to: emailSupport,
    subject: `${appName} - Invoice Admin`,
    template: 'layouts/invoiceAdmin',
    context: {
      ...data,
      domain,
      host,
      emailSupport,
      year: new Date().getFullYear(),
      url: `${domain}/invoiceAdmin`,
    },
  };
  await nodemailer(mailOptions);
};
