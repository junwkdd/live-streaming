const mongoose = require('mongoose');

const { Schema } = mongoose;

const videoSchema = new Schema({
  title: { type: String },
  description: { type: String },
  userID: { type: String },
  path: { type: String },
});

module.exports = mongoose.model('video', videoSchema);
