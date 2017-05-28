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
      payment: {
        type:String,
        enum:["Free","Paid"],
        default: "Free"
      },
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
        default: "equal"
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
