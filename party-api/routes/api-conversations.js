var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const User = require('../model/user');
const Party = require('../model/party');
const Image = require('../model/image');
const Conversation = require('../model/conversation');
const upload = require('../config/multer');
const passport = require('../config/passport');

/* GET Conversation listing. */
router.get('/', (req, res, next) => {
  let populateQuery=[{path: "party"},{path: "participants"}];


  Conversation.find({"participants":req.query.userId}).populate(populateQuery).exec((err, conversations) => {
    if (err) {
      return res.send(err);
    }
    console.log("conversations///////",conversations);

    return res.json(conversations);

  });

});

/* GET a single Conversation */
router.get('/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }

  let populateQuery=[{path: "party"},{path: "participants"}];

  Conversation.find({_id:req.params.id}).populate(populateQuery).exec((err, conversation) => {
    if (err) {
      return res.send(err);
    }

    return res.json(conversation);

  });
});

module.exports = router;
