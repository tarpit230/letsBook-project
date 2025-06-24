const mongoose = require("mongoose");

const chatMsgSchema = new mongoose.Schema({
  roomId: String,
  senderId: String,
  receiverId: String,
  message: String,
  user: {
    type: Object,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatMsgModel = mongoose.model('ChatMsg', chatMsgSchema);

module.exports = chatMsgModel;
