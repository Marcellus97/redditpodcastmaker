const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
        info: {
            title: 'Redditcast API',
            version: '1.0.0',
            description: 'Simple API for generating Reddit text to speech podcasts',
            contact: {
                name: "Marcellus Mohanna",
                url: "marcellus.dev",
                email: "mail@marcellus.dev"
            },
            license: "The MIT License"
        },
    },
  // List of files to be processes. You can also set globs './routes/*.js'
    apis: ['index.js'],
};

const specs = swaggerJsdoc(options);

exports.serve = swaggerUi.serve;
exports.setup = swaggerUi.setup;
exports.specs = specs;

