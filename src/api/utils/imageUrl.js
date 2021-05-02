const http = require('http');const fs = require('fs');

const getImageFormUrl = (url) => {
    return new Promise ((resolve, reject) => {
      http.get(url, function(body) {
        resolve(body)
      })
    })
  }

  module.exports = {
    getImageFormUrl
  };