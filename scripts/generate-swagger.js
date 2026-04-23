const fs = require('fs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sumatif API',
      version: '1.0.0',
      description: 'API documentation for Sumatif backend',
    },
  },
  apis: ['./src/routes/v1/*.js', './src/modules/**/controller.js'],
};

const spec = swaggerJsdoc(swaggerOptions);
const outPath = path.join(__dirname, '..', 'src', 'swagger.json');

fs.writeFileSync(outPath, JSON.stringify(spec, null, 2), 'utf8');
console.log('Wrote swagger spec to', outPath);
