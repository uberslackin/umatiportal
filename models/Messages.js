const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema({
  username: String,
  name: String,
  subject: String,
  sentfrom: String,
  sentto: String,
  tag: String,
  group: String,
  message: String,
  rmbysender: String,
  rmbyrecip: String,
  hash: String,
  date: Date,
  status: String,
 }, { timestamps: true });

const Messages = mongoose.model('Messages', messagesSchema);

module.exports = Messages;
