const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  id: { type: String },
  nickname: { type: String },
  pw: { type: String },
  subscribe: { type: Number, default: 0 },
  subscribing: { type: Array },
  like: { type: Array },
  hate: { type: Array },
  profile: { type: String, default: '/images/profile.png' },
});

module.exports = mongoose.model('user', userSchema);
