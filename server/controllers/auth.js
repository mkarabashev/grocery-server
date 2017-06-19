'use strict';

require('mongoose');

const User = require('../models/user');

exports.register = function register(req, res, next) {
  const { username, firstName, lastName } = req.body;

  User.findOneAndUpdate(
    { username },
    { $setOnInsert: { username, firstName, lastName } },
    { upsert: true, setDefaultsOnInsert: true }
  ).exec()
  // mongoose will only send an object if it found an existing entry, null otherwise
    .then(result => result
      ? Promise.reject(new Error({
        status: 400,
        message: 'Username already exists.'
      }))
      : res.status(201).json({
        message: 'Account created.'
      })
    )
    .catch(next);
};

exports.login = function login(req, res, next) {
  const { username } = req.body;

  User.findOne({ username }).populate('lists').exec()
    .then(account => account
      ? res.status(200).json(account)
      : Promise.reject(new Error({
        status: 401,
        message: 'Wrong username.'
      }))
    )
    .catch(next);
};
