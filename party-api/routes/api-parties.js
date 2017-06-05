var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const User = require('../model/user');
const Party = require('../model/party');
const Image = require('../model/image');
const upload = require('../config/multer');
const passport = require('../config/passport');
//const async = require('async');

/* GET Parties listing. */
router.get('/', (req, res, next) => {
  let populateQuery=[{path: "owner"},{path: "participants"},{path: "candidates"},{path:"pictures"}];
  if(req.query){
    let userId = mongoose.Types.ObjectId(req.query.userId);
    Party.find({$nor:[{participants:userId},{usersSeen:userId},{owner:userId}]}).populate(populateQuery).exec((err, Parties) => {
        if (err) {
          return res.send(err);
        }
        console.log("Parties",Parties);
        return res.json(Parties);
      });
    } else {
      Party.find({}).exec((err, Parties) => {
        if (err) {
          return res.send(err);
        }
        return res.json(Parties);
      });
    }
});

router.get('/joined', (req, res, next) => {
  let populateQuery=[{path: "owner"},{path: "participants"},{path: "pictures"}];
  let userId = mongoose.Types.ObjectId(req.query.userId);
  Party.find({participants:userId}).populate(populateQuery).exec((err, parties) => {
      if (err) {
        return res.send(err);
      }
      console.log("Parties",parties);
      return res.json(parties);
  });
});

/* GET a single Party. */
router.get('/:id', (req, res) => {
    console.log("hiFromGetParty");
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }
  let populateQuery=[{path: "owner",populate:{path:"profile.pictures", model:"Image"}},{path: "participants",populate:{path:"profile.pictures", model:"Image"}},{path:"pictures"}];
  Party.findById(req.params.id).populate(populateQuery).exec((err, party) => {
      if (err) {
        return res.send(err);
      }

      return res.json(party);
    });
});

/* EDIT a Party. */
router.put('/:id/edit', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }
  console.log("hiFromPutEditParty");
  Party.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    gender: req.body.gender,
    ageRange:{
      minAge: req.body.minAge,
      maxAge: req.body.maxAge,
    },
    payment: req.body.payment,
    content: req.body.content,
    numOfPeople:{
      numJoined: req.body.numJoined,
      maxPeople: req.body.maxPeople
    },
    parity: req.body.parity,
    placeType: req.body.placeType,
    size: req.body.size
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
router.delete('/:id/delete', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }

  Party.findOneAndRemove({ _id: req.params.id }, (err,party) => {
    if (err) {
      return res.send(err);
    }
    User.findOneAndUpdate({_id:party.owner},{'$pull': {'partiesOwned': party._id}},(err)=>{
      if(err){
        return res.send(err);
      }
        User.update({partiesJoined:party._id},{'$pull': {'partiesJoined': party._id, 'partiesSeen': party._id}},(err)=>{
          if(err){
            return res.send(err);
          }
          Image.deleteMany({party:party._id},(err)=>{
            if(err){
              return res.send(err);
            }
            console.log("entra en tots");
            return res.json({
              message: 'Party has been removed!'
            });
          });
        });
    });
  });
});

router.post('/new', /*upload.single('file'),*/ function(req, res) {

  console.log("hiFromPostNewParty");
  const party = new Party({
    score: 0,
    name: req.body.name,
    gender: req.body.gender,
    ageRange:{
      minAge: req.body.minAge,
      maxAge: req.body.maxAge,
    },
    payment: req.body.payment,
    content: req.body.content,
    date: req.body.date,
    theme: req.body.theme,
    numOfPeople:{
      minPeople: req.body.minPeople,
      maxPeople: req.body.maxPeople,
    },
    parity: req.body.parity,
    placeType: req.body.placeType,
    size: req.body.size,
    owner: req.body.owner,
    participants: []
    //image: `/uploads/${req.file.filename}`,
    //specs: JSON.parse(req.body.specs) || []
  });
  console.log("req.body.owner",req.body.owner);
  party.save((err) => {
    if (err) {
      return res.send(err);
    }
    console.log("newparty",party);
    User.findById({_id:req.body.owner._id}).populate("partiesOwned").exec((err,user)=>{
      if (err) {
        return res.send(err);
      }
      console.log("user",user);
      user.partiesOwned.push(party);
      user.save((err)=>{
        if (err) {
          return res.send(err);
        }
        return res.json({party:party});
      });
    });
  });
});

router.put('/:id/candidates/new',function(req, res) {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }
  console.log("hello from user candidates",req.body);
  Party.findByIdAndUpdate({_id:req.params.id},{'$push':{'candidates':req.body.id}},{"new":true},(err,party)=>{
    if(err){
      return res.send(err);
    }

    User.findByIdAndUpdate({_id:req.body.id},{'$push':{'partiesSeen':req.params.id}},(err)=>{
      if(err){
        return res.send(err);
      }
      return res.json({party:party});
    });
  });
});

router.put('/:id/participants/new',function(req, res) {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }
  console.log("hello from user participants",req.body);
  Party.findByIdAndUpdate({_id:req.params.id},{'$push':{'participants':req.body.id}},{"new":true},(err,party)=>{
    if(err){
      return res.send(err);
    }

    party.numOfPeople.numJoined++;
    party.save((err,partySaved)=>{
      if(err){
        return res.send(err);
      }
      User.findByIdAndUpdate({_id:req.body.id},{'$push':{'partiesJoined':req.params.id, 'partiesSeen':req.params.id}},(err)=>{
        if(err){
          return res.send(err);
        }
        return res.json({party:partySaved});
      });
    });
  });
});

router.put('/:id/partiesSeen/new',function(req, res) {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }
  User.findByIdAndUpdate({_id:req.body.id},{'$push':{ 'partiesSeen':req.params.id}},(err)=>{
    if(err){
      return res.send(err);
    }
    return res.json({
      message: 'Party with new candidate!'
    });
  });
});

router.put('/:id/participants/leave',function(req, res) {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }
  console.log("hello from user participants",req.body);
  Party.findByIdAndUpdate({_id:req.params.id},{'$pull':{'participants':req.body.id, 'candidates':req.body.id}},{"new":true},(err,party)=>{
    if(err){
      return res.send(err);
    }

    party.numOfPeople.numJoined--;
    party.save((err,partySaved)=>{
      if(err){
        return res.send(err);
      }

      User.findByIdAndUpdate({_id:req.body.id},{'$pull':{'partiesJoined':req.params.id}},(err)=>{
        if(err){
          return res.send(err);
        }
        return res.json({party:partySaved});
      });

    });
  });
});

module.exports = router;
