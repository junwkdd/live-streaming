const mongoose = require('mongoose');

const { Schema } = mongoose;

const videoSchema = new Schema({
  userID: { type: String },
  nickname: { type: String },
  title: { type: String },
  description: { type: String },
  date: { type: String },
  comments: { type: Array },
  view: { type: Number, default: 0 },
  like: { type: Number, default: 0 },
  hate: { type: Number, default: 0 },
  path: { type: String },
});

module.exports = mongoose.model('video', videoSchema);
