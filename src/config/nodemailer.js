const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: '',
  },
});

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

