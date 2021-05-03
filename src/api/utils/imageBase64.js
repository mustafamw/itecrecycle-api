const fs = require('fs');

const imageBase64 = (file) => {
  const bitmap = fs.readFileSync(file);
  return new Buffer.from(bitmap).toString('base64');
}

module.exports = {
  imageBase64
};