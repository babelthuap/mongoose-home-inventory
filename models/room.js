'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = Schema({
  name: { type: String, required: true },
  createdAt: {type: Date, default: Date.now()},
  items: [{ type: Schema.Types.ObjectId, ref: 'Item' }]
});


var Room = mongoose.model('Room', roomSchema);

module.exports = Room;
