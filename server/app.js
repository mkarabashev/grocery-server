'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const auth = require('./routes/auth');
const groceries = require('./routes/groceries');

module.exports = function setupServer () {
  // initialize express
  const app = express();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(logger('tiny'));

  // load the schema
  require('./models/user');
  require('./models/list');

  // security
  app.use(helmet());
  app.use(mongoSanitize());

  // server traffic
  app.use(cors({
    origin: process.env.ORIGIN
  }));

  app.use(compression({
    filter: (req, res) => req.headers['x-no-compression']
      ? false
      : compression.filter(req, res)
  }));

  //  provide API
  auth(app);
  groceries(app);

  // a json that explains the purpose of the server
  app.get('/', (req, res) => res.json({ msg: "grocery app api"}));

  // error handling
  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.json({
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: {}
    });
  });

  return app;
};
