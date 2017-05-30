const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    profile:{
      firstName: String,
      lastName: String,
      score: {
        type: Number,
        default: 0,
      },
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
      payment: {
        type:String,
        enum:["Free","Paid"],
        default: "Free"
      },
      parity: {
        type:String,
        enum:["equal","unchecked"],
        default: "unchecked"
      },
      placeType:{
        type:String,
        enum:["appartment","house","local","openAir","All"],
        default: "All"
      },
      size:{
        type: String,
        enum: ["small","average","big","All"],
        default: "All"
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
