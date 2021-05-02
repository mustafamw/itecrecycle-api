const request = require('request');

const getImageFormUrl = (url) => {
    return new Promise ((resolve, reject) => {
      request({ url, encoding: null }, (err, resp, buffer) => {
        resolve(buffer)
      });
    })
  }

  module.exports = {
    getImageFormUrl
  };