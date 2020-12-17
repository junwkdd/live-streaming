const mongoose = require('mongoose');

const { Schema } = mongoose;

const liveSchema = new Schema({
  userID: { type: String },
  nickname: { type: String },
  streamKey: { type: String },
  title: { type: String },
  description: { type: String },
  date: { type: String },
  view: { type: Number, default: 0 },
  like: { type: Number, default: 0 },
  hate: { type: Number, default: 0 },
});

module.exports = mongoose.model('live', liveSchema);
