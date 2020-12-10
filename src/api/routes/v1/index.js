const express = require('express');
const products = require('./products/routes');
const users = require('./users/routes');
const basket = require('./basket/routes');
const contactUs = require('./contactUs/routes');
const itemsCollection = require('./itemsCollection/routes');

const router = express.Router();

router.use('/docs', express.static('docs'));
router.use('/products', products);
router.use('/basket', basket);
router.use('/contact-us', contactUs);
router.use('/items-collection', itemsCollection);
router.use('/', users);

module.exports = router;
