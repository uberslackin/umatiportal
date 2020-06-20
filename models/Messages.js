const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema({
  name: String,
  subject: String,
  sentfrom: String,
  sentto: String,
  message: String,
  date: Date,
  status: String,
 }, { timestamps: true });

const Messages = mongoose.model('Messages', messagesSchema);

module.exports = Messages;