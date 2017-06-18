const mongoose = require('mongoose');

const User = require('../models/user');
const List = require('../models/list');

exports.createList = function createList(req, res, next) {
  const { username, listName } = req.body;

  new List({ name: listName }).save()
    .then(newList => User.findOneAndUpdate(
      { username },
      { $push: { lists: newList._id }}
    ))
    .then(result => result
      ? User.find({ username }).populate('lists')
      : Promise.reject({ status: 403, message: 'Bad username.'})
    )
    .then(userData => res.status(201).json(userData.lists))
    .catch(next);
}

const userHasList = (username, listId) => User
  .findOne({ username, lists: listId }).exec()
  .then(entry => entry || Promise.reject({
    status: 403,
    message: `Unauthorized: User ${username} doesn't have access to this list`
  }));

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
}

exports.addItem = function addItem(req, res, next) {
  const { username, listId, item } = req.body;

  userHasList(username, listId)
    .then(() => List.findOneAndUpdate(
      { _id: listId, "items.name": { $ne: item.name } },
      { $push: { items: item } },
      { new: true }
    ).exec())
    .then(result => result
      ? res.status(201).json(result)
      : Promise.reject({
        status: 400,
        message: `${item.name} already exists in the list`
      })
    )
    .catch(next);
}

exports.completeItem = function completeItem(req, res, next) {
  const { username, listId, itemId } = req.body;

  userHasList(username, listId)
    .then(() => List.findOneAndUpdate(
      { _id: listId, 'items._id': itemId },
      { $set: { "items.$.completed": true } },
      { new: true }
    ).exec())
    .then(result => res.status(200).json(result))
    .catch(next)
}

exports.removeItem = function removeItem(req, res, next) {
  const { username, listId, itemId } = req.body;

  userHasList(username, listId)
    .then(() => List.findOneAndUpdate(
      { _id: listId },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    ).exec())
    .then(result => res.status(200).json({ message: `Item deleted`}))
    .catch(next);
}

exports.getList = function getList(req, res, next) {
  const { username, _id } = req.query;

  User.findOne({ username })
    .populate({
      path: 'lists',
      match: { _id }
    })
    .then(result => {
      if (typeof result.lists[0] !== 'object') Promise.reject({ status: 500 })
      if (result.lists.length > 1) Promise.reject({ status: 500 })
      res.status(200).json(result.lists[0])
    })
    .catch(next);
}

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
}

exports.editItem = function editItem(req, res, next) {
  const { username, listId, itemName, newName, newNotes, timestamp } = req.body;

  userHasList(username, listId)
    .then(() => List.findOneAndUpdate(
      { _id: listId, "item.name": itemName, "item.modified_at": timestamp },
      { $set: { "item.notes": itemNotes } },
      { new: true }
    ))
    .then(result => res.status(200).json(result))
    .catch(next);
}
