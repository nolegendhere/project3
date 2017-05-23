var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const Party = require('../model/party');
const upload = require('../config/multer');
const passport = require('../config/passport');

/* GET Parties listing. */
router.get('/', (req, res, next) => {
  Party.find({})
    .exec((err, Parties) => {
      if (err) {
        return res.send(err);
      }
      return res.json(Parties);
    });
});

/* GET a single Party. */
router.get('/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }

  Party.findById(req.params.id, (err, Parties) => {
      if (err) {
        return res.send(err);
      }

      return res.json(Parties);
    });
});

/* EDIT a Party. */
router.put('/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }

  Party.findByIdAndUpdate(req.params.id, {
    // brand: req.body.brand,
    // name: req.body.name,
    // specs: req.body.specs,
    // image: req.body.image
  }, (err) => {
    if (err) {
      return res.send(err);
    }

    return res.json({
      message: 'Party updated successfully'
    });
  });
});

/* DELETE a Party. */
router.delete('/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }

  Party.remove({ _id: req.params.id }, (err) => {
    if (err) {
      return res.send(err);
    }

    return res.json({
      message: 'Party has been removed!'
    });
  });
});

router.post('/', upload.single('file'), function(req, res) {
  const party = new Party({
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
      message: 'New Party created!',
      party: party
    });
  });
});

module.exports = router;
