const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partySchema = new mongoose.Schema({
  score:{
    type: Number,
    default: 0,
  },
  gender:{
    type:String,
    enum:["Boys","Girls","BoysGirls"],
    default: "BoysGirls"
  },
  ageRange: {
    minAge: {
      type: Number,
      default: 18,
    },
    maxAge: {
      type: Number,
      default: 65,
    }
  },
  name: String,
  content: String,
  pictures: [{type:Schema.Types.ObjectId,ref:"Image"}],
  payment: {
    type:String,
    enum:["Free","Paid"],
    default: "Free"
  },
  numOfPeople: {
    // minPeople: {
    //   type: Number,
    //   default: 5,
    // },
    numJoined:{
      type: Number,
      default: 1
    },
    maxPeople: {
      type: Number,
      default: 20,
    }
  },
  parity: {
    type:String,
    enum:["equal","unchecked"],
    default: "unchecked"
  },
  placeType:{
    type:String,
    enum:["appartment","house","local","openAir"],
    default: "local"
  },
  size:{
    type: String,
    enum: ["small","average","big"],
    default: "average"
  },
  owner:{type:Schema.Types.ObjectId, ref:"User"},
  usersSeen:[{type: Schema.Types.ObjectId, ref:"Party"}],
  candidates:[{type: Schema.Types.ObjectId, ref:"User"}],
  participants:[{type: Schema.Types.ObjectId, ref:"User"}]
  }, {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
  }
});

module.exports = mongoose.model('Party', partySchema);
