const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const { environment } = require('../../environments/environment');

const {
  provider,
  host,
  port,
  username,
  password,
  secure,
} = environment.smtp;

const {
  env,
} = environment.express;

let transporter;
if (env === 'development') {
  transporter = nodemailer.createTransport({
    host,
    secure: false,
    auth: {
      user: username,
      pass: password,
    },
    tls: {
        rejectUnauthorized: false
    }
  });
} else {
  transporter = nodemailer.createTransport({
    host,
    port,
    auth: {
      user: username,
      pass: password,
    },
    secure,
  });
}

const options = {
  viewEngine: {
    extname: '.hbs',
    partialsDir: `${__dirname}/../api/views/partials/`,
    layoutsDir: `${__dirname}/../api/views/layouts/`,
    defaultLayout: '../main',
  },
  viewPath: `${__dirname}/../api/views/`,
  extName: '.hbs',
};

const send = mailOptions => (
  new Promise((resolve, reject) => {
    transporter.use('compile', hbs(options));
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        console.log(`Email sent: ${info.response}`);
        resolve();
      }
    });
  })
);

module.exports = send;

