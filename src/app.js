require('dotenv').config();

const express = require('express');
const webhookRoutes = require('./routes/webhook.routes');
const { requestLogger } = require('./middleware/logging');
const { errorHandler, notFoundHandler } = require('./middleware/errors');

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(requestLogger);

app.use('/webhook', webhookRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
