var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const User = require('../model/user');
const Party = require('../model/party');
const Image = require('../model/image');
const passport = require('../config/passport');
//const async = require('async');
var path = require('path');
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir: './uploads'});


router.get('/', (req, res, next) => {

  Image.find({},(err,images)=>{
    if (err) {
      return res.send(err);
    }
    return res.json(images);
  });
});

router.get('/:id', (req, res, next) => {

  Image.find({_id:req.params.id},(err,image)=>{
    if (err) {
      return res.send(err);
    }
    if(image.party){
      Party.populate(image,{path:"party"},(err,imagePopulated)=>{
        if (err) {
          return res.send(err);
        }
        return res.json({image:imagePopulated});
      });
    }else if(image.user){
      User.populate(image,{path:"user"},(err,imagePopulated)=>{
        if (err) {
          return res.send(err);
        }
        return res.json({image:imagePopulated});
      });
    }
  });
});


router.post('/upload-image/:id',multipartMiddleware, (req, res, next) => {
  var imageId = req.params.id;
  let file_name = "No subido...";
  if(req.files){
    let file_path = req.files.image.path;
    let file_split = file_path.split('\/');
    file_name = file_split[1];
    console.log("file_path",file_path);
    console.log("file_name",file_name);

    Image.findByIdAndUpdate({_id:imageId},{picture:file_name},{"new":true},(err,imageUpdated)=>{
      if (err) {
        return res.send(err);
      }
      return res.json({image:imageUpdated});
    });
  }
});

//http://localhost:3000/api/images/get-image/NtOFe9kPb942hgpcdLvMwfN_.jpg
router.get('/get-image/:imageFile',/*multipartMiddleware,*/(req,res,next)=>{
  var imageFile = req.params.imageFile;
  console.log("hiii");
  fs.exists('./uploads/'+imageFile, function(exists){
    if(exists){
      res.sendFile(path.resolve('./uploads/'+imageFile));
    }else{
      res.status(200).send({message: "image doesn't exist"});
    }
  });
});

router.post('/', (req, res, next) => {
  let image = new Image();

  let params = req.body;

  if(params.party){
    image.party = params.party;
    image.picture = null;
    image.save((err,imageStored)=>{
      if (err) {
        return res.send(err);
      }
      Party.findById({_id:params.party}).populate("pictures").exec((err,party)=>{
        if (err) {
          return res.send(err);
        }
        party.pictures.push(image);
        party.save((err)=>{
          if (err) {
            return res.send(err);
          }
          return res.json({image:imageStored});
        });
      });
    });
  }else if(params.user){
    image.user = params.user;
    image.picture = null;
    image.save((err,imageStored)=>{
      if (err) {
        return res.send(err);
      }
      User.findById({_id:params.user}).populate("profile.pictures").exec((err,user)=>{
        if (err) {
          return res.send(err);
        }
        user.profile.pictures.push(image);
        user.save((err)=>{
          if (err) {
            return res.send(err);
          }
          return res.json({image:imageStored});
        });
      });
    });
  }
});


router.delete('/:id', (req, res, next) => {
  console.log("entra");
  Image.findByIdAndRemove({_id:req.params.id},(err,imageDeleted)=>{
    if (err) {
      return res.send(err);
    }
    if(imageDeleted.party){
      Party.findOneAndUpdate({_id:imageDeleted.party},{$pull:{pictures:imageDeleted._id}},(err)=>{
        return res.json({image:imageDeleted});
      });
    }else if(imageDeleted.user){
      User.findOneAndUpdate({_id:imageDeleted.user},{$pull:{"profile.pictures":imageDeleted._id}},(err)=>{
        return res.json({image:imageDeleted});
      });
    }
  });
});


module.exports = router;
