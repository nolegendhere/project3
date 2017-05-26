const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    profile:{
      firstName: String,
      lastName: String,
      score: Number,
      gender: {
        type:String,
        enum:["Boy","Girl"],
        default: "Boy"
      },
      age: Number,
      pictures:[String]
    },
    partyPreferences:{
      gender:{
        type:String,
        enum:["Boys","Girls","BoysGirls"],
        default: "BoysGirls"
      },
      ageRange: {
        type: String,
        enum: ["18-25","20-30","25-35","30-40","35-45","40-50","45-55","50-60","55-65","All"],
        default:"All"
      },
      payment: {
        type:String,
        enum:["Free","Paid"],
        default: "Free"
      },
      maxPeople: Number,
      minPeople: Number,
      theme: String,
      parity: {
        type:String,
        enum:["equal","unchecked"]
      },
      placeType:{
        type:String,
        enum:["appartment","house","local","openAir"],
        default: "local"
      },
      size:{
        type: String,
        enum: ["small","average","big"]
      }
    },
    partiesOwned: [{type: Schema.Types.ObjectId, ref:"Party"}],
    partiesSeen:[{type: Schema.Types.ObjectId, ref:"Party"}],
    partiesJoined:[{type: Schema.Types.ObjectId, ref:"Party"}]
  }, {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
  }
});

module.exports = mongoose.model('User', userSchema);
