var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const User = require('../model/user');
const Party = require('../model/party');
const Image = require('../model/image');
const upload = require('../config/multer');
const passport = require('../config/passport');
const async = require('async');

/* GET Users listing. */
router.get('/', (req, res, next) => {
  let populateQuery=[{path: "partiesOwned"},{path:"profile.pictures"}];
  if(req.query){
    Party.findById({_id:req.query.partyId},(err,party)=>{
      let partyId = mongoose.Types.ObjectId(req.query.partyId);
      // User.find({partiesOwned:{$not:{$all:[partyId] }}}).exec((err, Users) =>
      // let populateQuery=[{path: "partiesOwned"}];
      User.find({$nor:[{partiesOwned:partyId},{partiesSeen:partyId}]}).populate(populateQuery).exec((err, Users) => {
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
  let populateQuery=[{path: "partiesOwned",populate:{path:"pictures", model:"Image"}},{path:"profile.pictures"}];
  User.findById(req.params.id).populate(populateQuery).exec((err, user) => {
      if (err) {
        return res.send(err);
      }
      return res.json(user);
    });
});

/* EDIT a User. */
router.put('/:id/edit', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }
  console.log("req.body",req.body);
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
      payment: req.body.paymentPreferences,
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

    Image.deleteMany({user:user._id},(err)=>{
      if(err){
        return res.send(err);
      }

      Party.update({participants:user._id},{'$pull': {'participants': user._id, 'candidates':user._id, 'usersSeen': user._id }},(err)=>{
        if(err){
          return res.send(err);
        }
        Party.find({owner:user._id},(err,parties)=>{
          if (err) {
            return res.send(err);
          }
          Party.remove({owner:user._id},(err)=>{
            if (err) {
              return res.send(err);
            }

            async.each(parties, function(party, callback) {
              User.update({partiesJoined:party._id},{'$pull': {'partiesJoined': party._id, 'partiesSeen': party._id }},{new:true},(err)=>{
                if(err){
                  callback(err);
                }else{
                  Image.deleteMany({party:party._id},(err)=>{
                    if(err){
                      return res.send(err);
                    }
                    console.log("borrant");
                    callback();
                  });
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
  });
});

router.put('/:id/candidates/new',function(req, res) {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }
  console.log("hello from party candidates",req.body);
  Party.findByIdAndUpdate({_id:req.body.id},{'$push':{'candidates':req.params.id,'usersSeen':req.params.id}},{'new':true},(err,party)=>{
    if(err){
      return res.send(err);
    }
    return res.json({
      message: 'Party with new candidate!'
    });
  });
});

router.put('/:id/participants/new',function(req, res) {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }
  console.log("hello from party participants",req.body);
  Party.findByIdAndUpdate({_id:req.body.id},{'$push':{'participants':req.params.id,'usersSeen':req.params.id}},{'new':true},(err,party)=>{
    if(err){
      return res.send(err);
    }

    party.numOfPeople.numJoined++;
    party.save((err)=>{
      if(err){
        return res.send(err);
      }

      User.findByIdAndUpdate({_id:req.params.id},{'$push':{'partiesJoined':req.body.id}},(err)=>{
        if(err){
          return res.send(err);
        }
        return res.json({
          message: 'Party with new candidate!'
        });
      });
    });
  });
});

router.put('/:id/usersSeen/new',function(req, res) {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }
  Party.findByIdAndUpdate({_id:req.body.id},{'$push':{'usersSeen':req.params.id}},{'new':true},(err)=>{
    if(err){
      return res.send(err);
    }
    return res.json({
      message: 'Party with new candidate!'
    });
  });
});


module.exports = router;
