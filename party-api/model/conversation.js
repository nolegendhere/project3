const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversationSchema = new mongoose.Schema({
    room: String,
    participants: [{type: Schema.Types.ObjectId, ref:"User"}],
    party:{type: Schema.Types.ObjectId, ref:"Party"}
    // connectedChatBy:[{type: Schema.Types.ObjectId, ref:"User"}]
  }, {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
  }
});

module.exports = mongoose.model('Conversation', conversationSchema);
