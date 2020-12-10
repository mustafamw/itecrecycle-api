const express = require('express');
const validate = require('express-validation');
const ProductsController = require('../../../controllers/products/products');
const schema = require('../../../schemas/products/products');

const router = express.Router();

/**
   * @api {get} v1/users List Users
   * @apiDescription Get a list of users
   * @apiVersion 1.0.0
   * @apiName ListUsers
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Users per page
   * @apiParam  {String}             [name]       User's name
   * @apiParam  {String}             [email]      User's email
   * @apiParam  {String=user,admin}  [role]       User's role
   *
   * @apiSuccess {Object[]} users List of users.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
*/
router.route('/')
  .get(validate(schema.products), ProductsController.getProducts);

router.route('/:productId')
  .get(validate(schema.productId), ProductsController.getProductId);

module.exports = router;
