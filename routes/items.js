'use strict';

let express = require('express');
let router = express.Router();

let Item = require('../models/item');

router.get('/', (req, res) => {
  Item.find({}, (err, items) => {
    res.status(err ? 400 : 200).send(err || items);
  });
});



// find one thing identified by URL parameter
// the colon ':' makes it into a parameter
// req.params is an object {id: <uri>}
router.get('/:_id', (req, res) => {
  Item.findOne({_id: req.params._id}, (err, item) => {
    res.status(err ? 400 : 200).send(err || item);
  });
});

// get items with a value less than 'val'
router.get('/value/gt/:val', (req, res) => {
  Item.find({value: {$gt: req.params.val}}, (err, item) => {
    res.status(err ? 400 : 200).send(err || item);
  });
});

// get items with a value greater than 'val'
router.get('/value/lt/:val', (req, res) => {
  Item.find({value: {$lt: req.params.val}}, (err, item) => {
    res.status(err ? 400 : 200).send(err || item);
  });
});


// update an item by id, only passing it the properties to change
router.put('/:id', (req, res) => {
  Item.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, item) => {
    res.status(err ? 400 : 200).send(err || 'updated!');
  });
});


// delete by id
router.delete('/:id', (req, res) => {
  Item.findByIdAndRemove(req.params.id, (err, item) => {
    res.status(err ? 400 : 200).send(err || 'deleted!');
  });
});




// add an item, send back the item's mongoId
router.post('/', (req, res) => {
  let item = new Item(req.body);
  item.save((err, storedItem) => {
    res.status(err ? 400 : 200).send(err || storedItem._id);
  });
});

module.exports = router;
