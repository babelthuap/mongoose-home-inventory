'use strict';

var mongoose = require('mongoose');


var itemSchema = mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  description: String,
  createdAt: {type: Date, default: Date.now()}
});


var Item = mongoose.model('Item', itemSchema);

module.exports = Item;
