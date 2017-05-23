const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const messageSchema = new mongoose.Schema({
  message:String,
  owner:{type: Schema.Types.ObjectId, ref:"User"},
  dest:{type: Schema.Types.ObjectId, ref:"User"},
  partyOwner:{type: Schema.Types.ObjectId, ref:"Party"},
  partyDest:{type: Schema.Types.ObjectId, ref:"Party"}
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
}
});

module.exports = mongoose.model('Message', messageSchema);
