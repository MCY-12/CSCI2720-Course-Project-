const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }, // Linking comment to tweet
  postedAt: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  comments: [commentSchema],
  retweetCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
