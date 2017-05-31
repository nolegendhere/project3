const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new mongoose.Schema({
  picture: String,
  user:{type:Schema.Types.ObjectId, ref:"User"},
  party:{type:Schema.Types.ObjectId, ref:"Party"},
});

module.exports = mongoose.model('Image', imageSchema);
