var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const User = require('../model/user');
const Party = require('../model/party');
const upload = require('../config/multer');
const passport = require('../config/passport');
//const async = require('async');

/* GET Parties listing. */
router.get('/', (req, res, next) => {
  let populateQuery=[{path: "owner"},{path: "participants"},{path: "candidates"}];
  if(req.query){
    let userId = mongoose.Types.ObjectId(req.query.userId);
    Party.find({$nor:[{participants:userId},{usersSeen:userId},{owner:userId}]}).populate(populateQuery).exec((err, Parties) => {
        if (err) {
          console.log("hello1");
          return res.send(err);
        }
        console.log("hello2");
        console.log("Parties",Parties);
        return res.json(Parties);
      });
    } else {
      Party.find({}).exec((err, Parties) => {
        if (err) {
          console.log("hello1");
          return res.send(err);
        }
        console.log("hello2");
        return res.json(Parties);
      });
    }
});

/* GET a single Party. */
router.get('/:id', (req, res) => {
    console.log("hiFromGetParty");
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }

  Party.findById(req.params.id).populate("owner").exec((err, Parties) => {
      if (err) {
        return res.send(err);
      }

      return res.json(Parties);
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
      minPeople: req.body.minPeople,
      maxPeople: req.body.maxPeople,
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
        return next(err);
      }else{
        User.update({partiesJoined:party._id},{'$pull': {'partiesJoined': party._id, 'partiesSeen': party._id}},(err)=>{
          if(err){
            return next(err);
          }else{
            console.log("entra en tots");
            return res.json({
              message: 'Party has been removed!'
            });
          }
        });
      }
    });
  });
});

// async.each(openFiles, function(file, callback) {
//   fs.unlink(path.join(destDir, picture.pic_path), (err)=>{
//      if(err){
//        callback(err);
//        return;
//      }else{
//        picture.remove((err)=>{
//          if(err){
//            callback(err);
//            return;
//          }
//          callback();
//        });
//      }
//   });
// }, function(err) {
//     // if any of the file processing produced an error, err would equal that error
//     if( err ) {
//       // One of the iterations produced an error.
//       // All processing will now stop.
//       console.log('A file failed to process');
//     } else {
//
//     }
//   }
// });

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
        return res.json({
          message: 'New Party created!',
          party: party
        });
      });
    });
  });
});

router.put('/:id/candidates/new',function(req, res) {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }
  console.log("hello from user candidates",req.body);
  Party.findByIdAndUpdate({_id:req.params.id},{'$push':{'candidates':req.body.id}},(err)=>{
    if(err){
      return res.send(err);
    }

    User.findByIdAndUpdate({_id:req.body.id},{'$push':{'partiesSeen':req.params.id}},{'new':true},(err)=>{
      if(err){
        return res.send(err);
      }
      return res.json({
        message: 'Party with new candidate!',
        user: user
      });
    });
  });
});

router.put('/:id/participants/new',function(req, res) {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }
  console.log("hello from user participants",req.body);
  Party.findByIdAndUpdate({_id:req.params.id},{'$push':{'participants':req.body.id}},(err)=>{
    if(err){
      return res.send(err);
    }

    User.findByIdAndUpdate({_id:req.body.id},{'$push':{'partiesJoined':req.params.id, 'partiesSeen':req.params.id}},{"new":true},(err,user)=>{
      if(err){
        return res.send(err);
      }
      return res.json({
        message: 'Party with new candidate!',
        user: user
      });
    });
  });
});

module.exports = router;
