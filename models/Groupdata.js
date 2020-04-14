const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');

const groupdataSchema = new mongoose.Schema({
  name: String,
  admin: String,
  secret: String,
  amount: String,
  sourcename: String,
  sourcenum: String,
  sourcetype: String,
  transhash: String,
  date: Date,
  group: String,
  witness: String,
  comment: String
 }, { timestamps: true });

const Groupdata = mongoose.model('Groupdata', groupdataSchema);

module.exports = Groupdata;