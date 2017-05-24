const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partySchema = new mongoose.Schema({
  score:Number,
  sex:{
    type:String,
    enum:["Boys","Girls","BoysGirls"],
    default: "BoysGirls"
  },
  ageRange: {
    type: String,
    enum: ["18-25","20-30","25-35","30-40","35-45","40-50","45-55","50-60","55-65","All"],
    default:"All"
  },
  name: String,
  content: String,
  pictures: [String],
  payment: {
    type:String,
    enum:["Free","Paid"],
    default: "Free"
  },
  date: Date,
  theme: String,
  maxPeople: Number,
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
