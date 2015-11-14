'use strict';

let express = require('express');
let router = express.Router();

let Room = require('../models/room');

router.get('/', function(req, res) {
  Room.find({}).populate('items').sort('name').exec((err, rooms) => {
    res.render("index", {rooms: rooms});
  });
});

module.exports = router;
