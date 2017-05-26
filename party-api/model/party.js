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
  pictures: [String],
  payment: {
    type:String,
    enum:["Free","Paid"],
    default: "Free"
  },
  date: {
    type: Date,
    default: new Date(new Date().getTime()),
  },
  theme: String,
  numOfPeople: {
    minPeople: {
      type: Number,
      default: 5,
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
  participants:[{type: Schema.Types.ObjectId, ref:"User"}]
  }, {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
  }
});

module.exports = mongoose.model('Party', partySchema);
