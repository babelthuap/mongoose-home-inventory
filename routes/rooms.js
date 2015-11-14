'use strict';

let express = require('express');
let router = express.Router();

let Room = require('../models/room');
let Item = require('../models/item');

router.get('/', (req, res) => {
  // 'populate' expands objectIds to full items
  // Room.find({}).populate('items').exec((err, rooms) => {
  //   res.status(err ? 400 : 200).send(err || rooms);
  // });

  // different syntax
  Room.find({}, (err, rooms) => {
    res.status(err ? 400 : 200).send(err || rooms);
  }).populate('items');
});



// fault tolerant route to add an item to a room
router.put('/:roomId/addItem/:itemId', (req, res) => {
  Room.findById(req.params.roomId, (err, room) => {
    if (err) return res.status(400).send(err.message);
    Item.findById(req.params.itemId, (err, item) => {

      // check if item is already in room
      if (room.items.indexOf(item._id) === -1) {
        if (err) return res.status(400).send(err.message);
        room.items.push(item._id); // this is where the actual adding occurs
        room.save(err => {
          res.status(err ? 400 : 200).send(err || 'item added to room!');
        });
      } else {
        res.status(400).send('item already in room');
      }

    });
  });
});



// find one room identified by URL parameter
router.get('/:_id', (req, res) => {
  Room.findOne({_id: req.params._id}, (err, room) => {
    res.status(err ? 400 : 200).send(err || room);
  });
});


// update a room by id, only passing it the properties to change
router.put('/:id', (req, res) => {
  Room.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, room) => {
    res.status(err ? 400 : 200).send(err || 'room updated!');
  });
});


// delete by id
router.delete('/:id', (req, res) => {
  Room.findByIdAndRemove(req.params.id, (err, room) => {
    res.status(err ? 400 : 200).send(err || 'room deleted!');
  });
});


// add a room
router.post('/', (req, res) => {
  let room = new Room(req.body);
  room.save((err, storedRoom) => {
    res.status(err ? 400 : 200).send(err || `added: ${storedRoom}`);
  });
});

module.exports = router;
