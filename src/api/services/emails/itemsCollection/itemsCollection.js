const nodemailer = require('../../../../config/nodemailer');
const { environment } = require('../../../../../environments/environment');
const moment = require('moment-timezone');

exports.email = async ({
  userDetails,
  itemsCollectionDetails,
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
    itemsCollection: itemsCollectionDetails,
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
    subject: `${appName} - Items Collection`,
    template: 'layouts/itemsCollection',
    context: {
      ...data,
      domain,
      host,
      emailSupport,
      year: new Date().getFullYear(),
      url: `${domain}/itemsCollection`,
    },
  };
  await nodemailer(mailOptions);
};

exports.emailAdmin = async ({
  userDetails,
  itemsCollectionDetails,
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
    itemsCollection: itemsCollectionDetails,
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
    subject: `${appName} - Items Collection Admin`,
    template: 'layouts/itemsCollectionAdmin',
    context: {
      ...data,
      domain,
      host,
      emailSupport,
      year: new Date().getFullYear(),
      url: `${domain}/itemsCollectionAdmin`,
    },
  };
  await nodemailer(mailOptions);
};
