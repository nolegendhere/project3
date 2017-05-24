var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const User = require('../model/user');
const Party = require('../model/party');
const upload = require('../config/multer');
const passport = require('../config/passport');

/* GET Users listing. */
router.get('/', (req, res, next) => {
  // let populateQuery=[{path: "partiesOwned"}];
  User.find({}).exec((err, Users) => {
      if (err) {
        console.log("hello1");
        return res.send(err);
      }
      console.log("hello2");
      return res.json(Users);
    });
});

/* GET a single User. */
router.get('/:id', (req, res) => {
  console.log("hiFromGetUser");
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }
  let populateQuery=[{path: "partiesOwned"}];
  User.findById(req.params.id).populate(populateQuery).exec((err, Users) => {
      if (err) {
        return res.send(err);
      }
      return res.json(Users);
    });
});

/* EDIT a User. */
router.put('/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }

  User.findByIdAndUpdate(req.params.id, {
    // brand: req.body.brand,
    // name: req.body.name,
    // specs: req.body.specs,
    // image: req.body.image
  }, (err) => {
    if (err) {
      return res.send(err);
    }

    return res.json({
      message: 'User updated successfully'
    });
  });
});

/* DELETE a User. */
router.delete('/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }

  User.remove({ _id: req.params.id }, (err) => {
    if (err) {
      return res.send(err);
    }

    return res.json({
      message: 'User has been removed!'
    });
  });
});

router.post('/', upload.single('file'), function(req, res) {
  const party = new User({
  //   name: req.body.name,
  //   brand: req.body.brand,
  //   image: `/uploads/${req.file.filename}`,
  //   specs: JSON.parse(req.body.specs) || []
  });

  party.save((err) => {
    if (err) {
      return res.send(err);
    }

    return res.json({
      message: 'New User created!',
      party: party
    });
  });
});

module.exports = router;
