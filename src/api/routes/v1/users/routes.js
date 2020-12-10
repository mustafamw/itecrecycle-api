const express = require('express');
const validate = require('express-validation');
const UsersController = require('../../../controllers/users/users');
const schema = require('../../../schemas/users/users');

const router = express.Router();

router.route('/signup')
  .post(validate(schema.signup), UsersController.signup);

router.route('/login')
  .post(validate(schema.login), UsersController.login);

router.route('/activate')
  .post(validate(schema.activate), UsersController.activate);

router.route('/forgot-password')
  .post(validate(schema.forgotPassword), UsersController.forgotPassword);

router.route('/reset-password')
  .post(validate(schema.resetPassword), UsersController.resetPassword);

router.route('/reset-password/valid')
  .post(validate(schema.resetPasswordValid), UsersController.resetPasswordValid);

router.route('/resend-activation')
  .post(validate(schema.resendActivation), UsersController.resendActivation);

module.exports = router;
