'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

module.exports = function setupServer () {
  // initialize express
  const app = express();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(logger('tiny'));

  // load the schema

  // security
  app.use(helmet());
  app.use(mongoSanitize());

  // server traffic
  app.use(cors());

  app.use(compression({
    filter: (req, res) => req.headers['x-no-compression']
      ? false
      : compression.filter(req, res)
  }));

  //  provide API

  return app;
};
