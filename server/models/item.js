const mongoose = require('mongoose');

module.exports = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: false
  },
  completed: {
    type: Boolean,
    default: false
  },
  modified_at: {
    type: Date,
    default: Date.now()
  }
});
