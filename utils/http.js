const http = require('https');

const doRequest = (url, headers) => {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { headers }, (res) => {
      const result = {
        responseBody: '',
        statusCode: res.statusCode,
      }

      res.on('data', (chunk) => {
        result.responseBody += chunk;
      });

      res.on('end', () => resolve(result));

      res.on('error', (err) => reject(err.message));
    });

    req.on('error', (err) => reject(err.message));
    req.end();
  });
};

module.exports = { doRequest };
