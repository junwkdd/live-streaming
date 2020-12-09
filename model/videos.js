const mongoose = require('mongoose');
const moment = require('moment');

const { Schema } = mongoose;

const videoSchema = new Schema({
  userID: { type: String },
  title: { type: String },
  description: { type: String },
  nickname: { type: String },
  date: { type: String, default: moment().format('YYYY.MM.DD') },
  path: { type: String },
});

module.exports = mongoose.model('video', videoSchema);
