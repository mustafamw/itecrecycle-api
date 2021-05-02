const https = require('https');

const getImageFormUrl = (url) => {
    return new Promise ((resolve, reject) => {
      https.get(url, function(body) {
        resolve(body)
      })
    })
  }

  module.exports = {
    getImageFormUrl
  };