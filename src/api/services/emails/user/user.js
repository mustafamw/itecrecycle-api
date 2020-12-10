const nodemailer = require('../../../../config/nodemailer');
const { environment } = require('../../../../../environments/environment');

exports.activate = async (data) => {
  const {
    appName,
    domain,
    host,
  } = environment.express;
  const {
    email,
  } = data;
  const {
    email: emailSupport,
  } = environment.supportInfo;
  const mailOptions = {
    from: emailSupport,
    to: email,
    subject: `${appName} - Please activate your login`,
    template: 'layouts/activate',
    context: {
      ...data,
      domain,
      host,
      emailSupport,
      url: `${domain}/activate`,
    },
  };
  await nodemailer(mailOptions);
};

exports.forgotPassword = async (data) => {
  const {
    appName,
    domain,
    host,
  } = environment.express;
  const {
    email,
  } = data.dataValues;
  const {
    email: emailSupport,
  } = environment.supportInfo;
  const mailOptions = {
    from: emailSupport,
    to: email,
    subject: `${appName} - Password reset`,
    template: 'layouts/forgotPassword',
    context: {
      ...data,
      domain,
      host,
      emailSupport,
      year: new Date().getFullYear(),
      url: `${domain}/reset-password`,
    },
  };
  await nodemailer(mailOptions);
};
