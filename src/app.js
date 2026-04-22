const express = require('express');
const apiV1Routes = require('./routes/v1');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', apiV1Routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
