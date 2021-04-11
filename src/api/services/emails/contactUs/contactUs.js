const nodemailer = require('../../../../config/nodemailer');
const { environment } = require('../../../../../environments/environment');

exports.email = async (data) => {
  const {
    appName,
    domain,
    host,
  } = environment.express;
  const {
    email: emailSupport,
  } = environment.supportInfo;
  const mailOptions = {
    from: data.email,
    to: emailSupport,
    subject: `${appName} - Enquiry`,
    template: 'layouts/contactUs',
    context: {
      ...data,
      domain,
      host,
      emailSupport,
      year: new Date().getFullYear(),
      url: `${domain}/contactUs`,
    },
  };
  await nodemailer(mailOptions);
};
