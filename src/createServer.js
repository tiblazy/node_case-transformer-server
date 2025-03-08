const http = require('http');
const { convertToCase } = require('./convertToCase/convertToCase');
const { validationRequest } = require('./convertToCase/validationRequest');

function createServer() {
  return http.createServer((req, res) => {
    const validationErrors = [];

    try {
      const { pathname, searchParams } = new URL(
        req.url,
        `http://${req.headers.host}`,
      );

      const originalText = pathname.slice(1);
      const targetCase = searchParams.get('toCase')?.toUpperCase();

      validationRequest(originalText, targetCase, validationErrors);

      if (validationErrors.length > 0) {
        throw new Error('');
      }

      const { originalCase, convertedText } = convertToCase(
        originalText,
        targetCase,
      );

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;

      res.end(
        JSON.stringify({
          originalCase,
          targetCase,
          convertedText,
          originalText,
        }),
      );
    } catch (error) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 400;

      res.end(
        JSON.stringify({
          errors: validationErrors.map((message) => ({
            message,
          })),
        }),
      );
    }
  });
}

module.exports = { createServer };
