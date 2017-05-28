var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const User = require('../model/user');
const Party = require('../model/party');
const upload = require('../config/multer');
const passport = require('../config/passport');
const async = require('async');

/* GET Users listing. */
router.get('/', (req, res, next) => {
  let populateQuery=[{path: "partiesOwned"}];
  if(req.query){
    Party.findById({_id:req.query.partyId},(err,party)=>{
      var partyId = mongoose.Types.ObjectId(req.query.partyId);
      // User.find({partiesOwned:{$not:{$all:[partyId] }}}).exec((err, Users) =>
      // let populateQuery=[{path: "partiesOwned"}];
      User.find({$nor:[{partiesOwned:partyId},{partiesSeen:partyId}]}).populate().exec((err, Users) => {
        if (err) {
          console.log("hello1",err);
          return res.send(err);
        }
        //console.log("hello2",Users);
        return res.json(Users);
      });
    });
  } else {
    User.find({}).exec((err, Users) => {
      if (err) {
        console.log("hello1");
        return res.send(err);
      }
      console.log("hello2");
      return res.json(Users);
    });
  }
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
router.put('/:id/edit', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }

  console.log("HiFromEdituser1");
  console.log("req.params.id",req.params.id);
  // console.log("req.body.firstName",req.body.firstName);
  // console.log("req.body.firstName",req.body.firstName);
  // console.log("req.body.firstName",req.body.firstName);
  // console.log("req.body.firstName",req.body.firstName);
  User.findByIdAndUpdate(req.params.id, {
    profile:{
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      age: req.body.age,
    },
    partyPreferences:{
      gender: req.body.genderPreferences,
      ageRange:{
        minAge: req.body.minAgePreferences,
        maxAge: req.body.maxAgePreferences,
      },
      payment: req.body.paymentPreferences,
      numOfPeople:{
        minPeople: req.body.minPeoplePreferences,
        maxPeople: req.body.maxPeoplePreferences,
      },
      parity: req.body.parityPreferences,
      placeType: req.body.placeTypePreferences,
      size: req.body.sizePreferences
    },
  }, (err) => {
    if (err) {
      console.log("HiFromEdituser2");
      return res.send(err);
    }
    console.log("HiFromEdituser3");
    return res.json({
      message: 'User updated successfully'
    });
  });
});

/* DELETE a User. */
router.delete('/:id/delete', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }

  User.findOneAndRemove({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.send(err);
    }

    Party.update({participants:user._id},{'$pull': {'participants': user._id }},(err)=>{
      if(err){
        return res.send(err);
      }
      Party.find({owner:user._id},(err,parties)=>{
        if (err) {
          return res.send(err);
        }
        async.each(parties, function(party, callback) {
          User.update({partiesJoined:party._id},{'$pull': {'partiesJoined': party._id }},{new:true},(err)=>{
            if(err){
              callback(err);
            }else{
              console.log("borrant");
              callback();
            }
          });
        }, function(err) {
            // if any of the file processing produced an error, err would equal that error
            if( err ) {
              // One of the iterations produced an error.
              // All processing will now stop.
              console.log('A file failed to process');
            } else {
              console.log("finished");
              req.logout();
              return res.json({
                message: 'User deleted successfully'
              });
            }
        });
      });
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
