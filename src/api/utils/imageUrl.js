const request = require('request');

const getImageFormUrl = (url) => {
    return new Promise ((resolve, reject) => {
      request({ url, encoding: null }, (err, resp, buffer) => {
        if (resp.statusCode !== 200) {
          reject(resp)
        } else {
          resolve(buffer)
        }
      });
    })
  }

  module.exports = {
    getImageFormUrl
  };