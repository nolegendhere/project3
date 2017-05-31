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

router.post('/', multipartMiddleware, (req, res, next) => {
  let image = new Image();
  console.log("entra");
  let params = req.body;

  let file_name = "No subido...";

  if(req.files){
    let file_path = req.files.image.path;
    let file_split = file_path.split('\/');
    file_name = file_split[1];
    console.log("file_path",file_path);
    console.log("file_name",file_name);

    if(params.party){
      image.party = params.party;
      image.picture = file_name;
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
      image.picture = file_name;
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
  }
});


router.delete('/:id', (req, res, next) => {
  let params = req.body;
  if(params.party){
    Image.findByIdAndDelete({_id:req.params.id},(err,imageDeleted)=>{
      if (err) {
        return res.send(err);
      }
      Party.findOneAndUpdate({_id:params.party},{$pull:{pictures:imageDeleted._id}},(err)=>{
        return res.json({image:imageDeleted});
      });
    });
  }else if(params.user){
    Image.findByIdAndDelete({_id:req.params.id},(err,imageDeleted)=>{
      if (err) {
        return res.send(err);
      }
      User.findOneAndUpdate({_id:params.user},{$pull:{"profile.pictures":imageDeleted._id}},(err)=>{
        return res.json({image:imageDeleted});
      });
    });
  }
});


module.exports = router;
