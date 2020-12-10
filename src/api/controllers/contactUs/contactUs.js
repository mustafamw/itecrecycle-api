const contactUsService = require('../../services/contactUs/contactUs');


exports.contactUs = async (req, res, next) => {
  try {
    const data = await contactUsService.contactUs(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
