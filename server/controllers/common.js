'use strict';

require('mongoose');

const User = require('../models/user');

exports.userHasList = (username, listId) => User
  .findOne({ username, lists: listId }).exec()
  .then(entry => entry || Promise.reject(new Error({
    status: 403,
    message: `Unauthorized: User ${username} doesn't have access to this list`
  })));
