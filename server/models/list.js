const mongoose = require('mongoose');

const itemSchema = require('./item');

const listSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  items: [itemSchema],
  modified_at: {
    type: Date,
    default: Date.now()
  }  
});

module.exports = mongoose.model('List', listSchema);
