'use strict';

require('mongoose');

const User = require('../models/user');
const List = require('../models/list');
const userHasList = require('./common').userHasList;

exports.createList = function createList(req, res, next) {
  const { username, listName } = req.body;
  let listData = null;

  new List({ name: listName }).save()
    .then(newList => {
      listData = newList;

      return User.findOneAndUpdate(
        { username },
        { $push: { lists: newList._id } }
      );
    })
    .then(result => result
      ? res.status(201).json(listData)
      : Promise.reject(new Error({ status: 403, message: 'Bad username.' }))
    )
    .catch(next);
};

exports.deleteList = function deleteList(req, res, next) {
  const { username, listId } = req.body;

  userHasList(username, listId)
    .then(() => Promise.all([
      List.remove({ _id: listId }).exec(),
      User.update(
        { lists: listId },
        { $pull: { lists: listId } },
        { multi: true }
      ).exec()
    ]))
    .then(() => res.status(200).json({ message: `List ${listId} deleted.` }))
    .catch(next);
};

exports.getList = function getList(req, res, next) {
  const { username, _id } = req.query;

  User.findOne({ username })
    .populate({
      path: 'lists',
      match: { _id }
    })
    .then(result => res.status(200).json(result.lists[0]))
    .catch(next);
};

exports.changeListName = function changeListName(req, res, next) {
  const { username, listId, name } = req.body;

  userHasList(username, listId)
    .then(() => List.findOneAndUpdate(
      { _id: listId },
      { $set: { name } },
      { new: true }
    ))
    .then(result => res.status(200).json(result))
    .catch(next);
};
