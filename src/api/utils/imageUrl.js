const https = require('https');
const http = require('http');

const getImageFormUrl = (url) => {
    return new Promise ((resolve, reject) => {
      try {
        https.get(url, function(body) {
          console.log(body.statusCode)
          console.log(body.statusMessage)
          resolve(body)
        })
      } catch (error) {
        http.get(url, function(body) {
          console.log(body.statusCode)
          console.log(body.statusMessage)
          resolve(body)
        })
      }
    })
  }

  module.exports = {
    getImageFormUrl
  };