'use strict';

require('mongoose');

const List = require('../models/list');
const userHasList = require('./common').userHasList;

exports.addItem = function addItem(req, res, next) {
  const { username, listId, item } = req.body;

  userHasList(username, listId)
    .then(() => List.findOneAndUpdate(
      { _id: listId, 'items.name': { $ne: item.name } },
      { $push: { items: item } },
      { new: true }
    ).exec())
    .then(result => result
      ? res.status(201).json(result)
      : Promise.reject(new Error({
        status: 400,
        message: `${item.name} already exists in the list`
      }))
    )
    .catch(next);
};

exports.completeItem = function completeItem(req, res, next) {
  const { username, listId, itemId, completed } = req.body;

  userHasList(username, listId)
    .then(() => List.findOneAndUpdate(
      { _id: listId, 'items._id': itemId },
      { $set: { 'items.$.completed': completed } },
      { new: true }
    ).exec())
    .then(result => result || Promise.reject(new Error({
      status: 400, message: `Item doesn't exist.`
    })))
    .then(result => res.status(200).json(result))
    .catch(next);
};

exports.removeItem = function removeItem(req, res, next) {
  const { username, listId, itemId } = req.body;

  userHasList(username, listId)
    .then(() => List.findOneAndUpdate(
      { _id: listId },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    ).exec())
    .then(result => res.status(200).json({ message: `Item deleted` }))
    .catch(next);
};

exports.editItem = function editItem(req, res, next) {
  const { username, listId, itemId, newNotes, modified_at } = req.body;

  userHasList(username, listId)
    .then(() => List.findOneAndUpdate(
      { _id: listId, 'items._id': itemId, 'items.modified_at': modified_at },
      { $set: { 'items.$': { notes: newNotes, completed: false, modified_at: Date.now() } } },
      { new: true }
    ))
    .then(result => result || Promise.reject(new Error({
      status: 400,
      message: `The item was modified or doesn't exist`
    })))
    .then(result => res.status(200).json(result))
    .catch(next);
};
