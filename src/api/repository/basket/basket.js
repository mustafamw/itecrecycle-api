const { InvoicesModel } = require('../../models/invoices/invoices');
const { nanoid } = require('nanoid');
const productsRepository = require('../../repository/products/products');

exports.basket = async (jwtPayload, products) => {
  const userId = jwtPayload.uid;
  const referenceNo = nanoid(10).replace(/_/g, '').toUpperCase();
  products.forEach((e) => {
    e.userUserId = userId;
    e.productProductId = e.productId;
    e.referenceNo = referenceNo;
    delete e.productId;
  });
  await InvoicesModel.bulkCreate(products);
  await productsRepository.updateProductsStock(products);
  return { referenceNo };
};
